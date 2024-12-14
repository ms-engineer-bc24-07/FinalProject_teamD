from django.urls import path
from .views import send_invite, accept_invite, generate_invite_link

urlpatterns = [
    path('send_invite/', send_invite, name='send_invite'),
    path('accept_invite/', accept_invite, name='accept_invite'),
    path('generate_invite_link/', generate_invite_link, name='generate_invite_link'),  # 新しいエンドポイント
]
