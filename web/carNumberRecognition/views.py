from django.http import HttpResponse 
from django.shortcuts import render
from .forms import *
from django.core.files.storage import FileSystemStorage
import cv2

from .deeplearning import *

from django.views.decorators.csrf import csrf_exempt
import json

def index(request):
    form = CarForm()
    return render(request, 'index.html', {'form' : form,'resultOD':[],'flag':True})

@csrf_exempt
def object_detection(request):
    uploadFile = request.FILES['file']
    fs = FileSystemStorage()
    filename = fs.save(uploadFile.name, uploadFile)
    uploaded_file_url = fs.path(filename)
    resultOD=[]
    resultOD = exOD(tfnet1, uploaded_file_url)
    if len(resultOD)==0:
        resultOD.append('실행 결과가 없습니다.')

    return HttpResponse(json.dumps({'resultOD':resultOD}), content_type="application/json")


@csrf_exempt
def super_resolution(request):
    ODFile = request.POST.get('url','')
    print(ODFile)
    resultSR = exSR(ODFile) #ODFile
    return HttpResponse(json.dumps({'resultSR':resultSR}), content_type="application/json")

@csrf_exempt
def recognition(request):
    SRFile = request.FILES['file']
    recimage, license_plate = exRec(tfnet2)
    return HttpResponse(json.dumps({'resultRN':recimage, 'resultText':license_plate}), content_type="application/json")


#tfnet1 = Object_Detection()
#tfnet2 = Recognition()
