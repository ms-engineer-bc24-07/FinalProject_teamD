from django.urls import path
from .views import  accept_invite, generate_invite_link

urlpatterns = [
    path('accept_invite/', accept_invite, name='accept_invite'),
    path('generate_invite_link/', generate_invite_link, name='generate_invite_link'),  # 新しいエンドポイント
]
