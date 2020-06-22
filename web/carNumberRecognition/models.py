from django.db import models

# Create your models here.
class Car(models.Model):
    car_img = models.ImageField(upload_to='media/')