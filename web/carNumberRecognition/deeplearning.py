from darkflow.net.build import TFNet
import tensorflow as tf

import cv2
import matplotlib.pyplot as plt
from sys import exit
import numpy as np
import copy
import os

import keras
from tensorflow.keras.models import Model, Sequential
from tensorflow.keras.layers import Dense, Conv2D, Dropout, BatchNormalization, Input,Conv2DTranspose
from tensorflow.keras.layers import LeakyReLU
from keras.callbacks import ModelCheckpoint
from keras.optimizers import Adam, SGD
from keras.models import load_model
from PIL import ImageFont, ImageDraw, Image

#%config inlineBackend.figure_format = 'svg'
tf.logging.set_verbosity(tf.logging.ERROR)

#Oject_Detection
def Object_Detection():
    options = {'model' : 'C:/project/Object_Detection/cfg/lp_detect.cfg', 
                'backup' : 'C:/project/Object_Detection/ckpt',
                'load' : -1,
                'threshold' : 0.6,
                'gpu' : 0.5,
                'labels' : 'C:/project/Object_Detection/labels.txt',
                'train' : False,
              }

    tfnet = TFNet(options)
    return tfnet
    
#Recognition

def Recognition():
    options = {'model' : 'C:/project/Recognition/cfg/rec.cfg', 
                'backup' : 'C:/project/Recognition/ckpt',
                'load' : -1,
                'threshold' : 0.1,
                'gpu' : 0.5,
                'labels' : 'C:/project/Recognition/labels.txt',
                'train' : False,
              }

    tfnet = TFNet(options)
    return tfnet
    
def exOD(tfnet,inputimg):
    img = cv2.imread(inputimg, cv2.IMREAD_COLOR)
    img1= img

    #BGR 사진을 RGB 사진으로 변환
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    #json형태로 결과 출력
    results = tfnet.return_predict(img)

    img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)

    #이미지 3차원 행렬(y축, x축, 바로 색을 표현하는 BGR)
    img.shape

    #랜덤한 색으로 추출된 바운딩 박스와 라벨 표시
    resultimg = copy.deepcopy(img)
    colors = [tuple(255*np.random.rand(3)) for _ in range(1000)]
    crop_img_url = []
    global index
    index = 1
    while True:
        file = 'media/OD/crop_img' + str(index) + '.jpg'
        if os.path.isfile(file):
            os.remove(file)
            index += 1
        else:
            break
    index = 1
    for color, result in zip(colors, results):
        t1 = (result['topleft']['x'], result['topleft']['y'])
        br = (result['bottomright']['x'], result['bottomright']['y'])
        label = result['label']

        crop_img = img[t1[1]:br[1], t1[0]:br[0]]
        cv2.imwrite('media/OD/crop_img'+ str(index) +'.jpg', crop_img) 
        crop_img_url.append('media/OD/crop_img'+ str(index) +'.jpg')
        index += 1

        #resultimg = cv2.rectangle(resultimg, t1, br, color, 2)
        #resultimg = cv2.putText(resultimg, label, t1, cv2.FONT_HERSHEY_COMPLEX, 1, (0,0,0), 2)

    return crop_img_url

def exSR(ODFile):
    
    model = tf.keras.models.load_model("C:/project/Super_Resolution/model2_FCN_FSRCNN.h5")
    print(model.summary())
    imgLR = []
    print(ODFile)
    targetimg = cv2.imread(ODFile)
    targetimg = np.asarray(targetimg)
    
    imgLR.append(targetimg)
    imgLR = np.asarray(imgLR)
    SRresult = (model.predict(imgLR)[0])

    cv2.imwrite('C:/project/web/media/SR/SR.jpg', SRresult)

    SR_img_url = 'media/SR/SR.jpg'
    
    return SR_img_url

def exRec(tfnet2):
    img = cv2.imread('C:/project/web/media/SR/SR.jpg', cv2.IMREAD_COLOR)
    img1= img

    #BGR 사진을 RGB 사진으로 변환
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    #json형태로 결과 출력
    results = tfnet2.return_predict(img)
    #print((results))

    img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2RGB)
    #plot으로 원본 이미지 출력

    #이미지 3차원 행렬(y축, x축, 바로 색을 표현하는 BGR)
    imgsh=img.shape

    #랜덤한 색으로 추출된 바운딩 박스와 라벨 표시
    resultimg = copy.deepcopy(img)

    resultarray = []
    colors = [tuple(255*np.random.rand(3)) for _ in range(1000)]
    for color, result in zip(colors, results):
        t1 = (result['topleft']['x'], result['topleft']['y'])
        br = (result['bottomright']['x'], result['bottomright']['y'])
        label = result['label']
        confidence = result['confidence']

        resultarray.append(result)

        crop_img = img[t1[1]:br[1], t1[0]:br[0]]

    list_length = len(resultarray)

    for i in range(list_length-1):
        for j in range(list_length - i -1):
            if resultarray[j]['topleft']['x'] >= resultarray[j+1]['topleft']['x'] :
                resultarray[j],resultarray[j+1] = resultarray[j+1],resultarray[j]

   # for i in range(len(resultarray)):
   #     print(resultarray[i])

    wide = resultarray[0]['topleft']['x'],resultarray[len(resultarray)-1]['bottomright']['x']
   # print(wide[1]-wide[0])

    X = []
    
    for i in range(list_length):
        for j in range(list_length):
            if abs(resultarray[i]['topleft']['x']-resultarray[j]['topleft']['x']) <= (wide[1]-wide[0])/14:
                if(resultarray[i]['confidence'] > resultarray[j]['confidence']):
                    resultarray[j] = resultarray[i]
                else :
                    resultarray[i] = resultarray[j]
    
    for v in resultarray:
        if v not in X:
            X.append(v)
    
    #for i in range(len(X)):
    #    print(X[i])

    for result in resultarray:
        t1 = (result['topleft']['x'], result['topleft']['y'])
        br = (result['bottomright']['x'], result['bottomright']['y'])
        label = result['label']
        confidence = result['confidence']

        resultimg = cv2.rectangle(resultimg, t1, br, (255, 255, 0), 1)
        resultimg = cv2.putText(resultimg, label, (t1[0],br[1]), cv2.FONT_HERSHEY_SIMPLEX, 1*(imgsh[1]/300), (255, 255, 0), 1)
    
    cv2.imwrite('C:/project/web/media/Rec/Rec.jpg', resultimg)
    Rec_img_url = 'media/Rec/Rec.jpg'
    
    text = []
    for label in X:
        text.append(label['label'])
    
    return Rec_img_url, text