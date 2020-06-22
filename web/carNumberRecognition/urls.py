from django.urls import path
from django.conf import settings 
from django.conf.urls.static import static 
from .views import *

urlpatterns = [
    path('', index),
    path('detection', object_detection), 
    path('resolution', super_resolution), 
    path('recognition', recognition), 
]
  
if settings.DEBUG: 
        urlpatterns += static(settings.MEDIA_URL, 
document_root=settings.MEDIA_ROOT) 