from django import forms
from .models import *
  
class CarForm(forms.ModelForm): 
  
    class Meta:  
        model = Car
        fields = ['car_img']
        widgets= {
            'car_img' : forms.FileInput(attrs={'class':'main-section__form__input','id':'file'}),
        }
        labels = {
            'car_img' : '',
        }



