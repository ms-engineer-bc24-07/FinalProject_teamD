from django.urls import path
from .views import generate_invite_link, validate_invite

urlpatterns = [
    path('avalidate_invite/', validate_invite, name='validate_invite'),
    path('generate_invite_link/', generate_invite_link, name='generate_invite_link'),  # 新しいエンドポイント
]
