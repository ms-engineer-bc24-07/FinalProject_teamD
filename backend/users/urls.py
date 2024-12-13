from django.urls import path
from .views import register_user, get_user, send_invite, accept_invite

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('get_user/', get_user, name='get_user'),
    path('send_invite/', send_invite, name='send_invite'),  # 招待リンク生成エンドポイント
    path('accept_invite/<str:token>/', accept_invite, name='accept_invite'),  # 招待リンク処理エンドポイント
]
