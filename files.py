#!/usr/bin/env python
# coding: utf-8

# In[ ]:

from os import listdir
import cv2
import numpy as np
import xml.etree.ElementTree as ET

#xml 파일을 읽는 함수
def read_anntation(xml_file: str):
    #xml 파일을 파싱(특정 문서를 다른 프로그램이 사용할 수 있는 내부의 표현 방식으로 변환해 주는 것)함
    tree = ET.parse(xml_file)
    #문서의 최상단
    root = tree.getroot()

    #바운딩 박스를 저장할 list
    bounding_box_list = []

    #파싱된 문서에서 filename 태그의 내용을 문자열로 변환 후 변수에 저장
    file_name = root.find('filename').text
    #파싱된 문서에서 object 태그를 찾음
    for obj in root.iter('object'):
        
        #object 태그 내의 name 태그의 내용을 변수에 저장 
        object_label = obj.find("name").text
        #bndbox 태그를 모두 반복
        for box in obj.findall("bndbox"):
            #x 최소 좌표
            x_min = int(box.find("xmin").text)
            #y 최소 좌표
            y_min = int(box.find("ymin").text)
            #x 최대 좌표
            x_max = int(box.find("xmax").text)
            #y 최대 좌표
            y_max = int(box.find("ymax").text)

        #들여쓰기로 반복?
        #변수에 추출한 바운딩 박스 정보 저장
        bounding_box = [object_label, x_min, y_min, x_max, y_max]
        #리스트에 추가
        bounding_box_list.append(bounding_box)

    #바운딩 박스 리스트와 파일 이름 반환
    return bounding_box_list, file_name


# In[ ]:



#이미지와 xml 파일을 함께 읽는 함수
def read_train_dataset(dir):
    #이미지를 저장하는 배열
    images = []
    #xml 정보를 저장하는 배열
    annotations = []
    
    #경로에 있는 파일의 수 만큼 반복
    for file in listdir(dir):
        #jpg나 png 파일이 존재 하면
        if 'jpg' in file.lower() or 'png' in file.lower():
            #경로에 있는 이미지 파일을 컬러로 읽어 리스트에 추가
            images.append(cv2.imread(dir + file, 1))
            #파일 명의 확장자를 xml로 바꿈
            annotation_file = file.replace(file.split('.')[-1], 'xml')
            #바운딩 박스 리스트와 파일 이름을 read_annotation 함수를 호출하여 추출
            bounding_box_list, file_name = read_anntation(dir + annotation_file)
            #리스트의 파일 정보 저장
            annotations.append((bounding_box_list, annotation_file, file_name))

    #리스트 배열로 변환
    images = np.array(images)

    #이미지와 xml 정보 반환
    return images, annotations

