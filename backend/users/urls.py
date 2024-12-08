from django.urls import path
from .views import register_user, get_user

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('get_user/', get_user, name='get_user'),
]