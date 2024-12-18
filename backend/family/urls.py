from django.urls import path
from .views import validate_invite, get_group_info
urlpatterns = [
    path('validate_invite/', validate_invite, name='validate_invite'),
    path('get_group_info/', get_group_info, name='get_group_info'),  
]


