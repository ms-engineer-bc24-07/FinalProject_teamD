from django.urls import path
from .views import get_user, register_user, accept_invite, UpdateIconAPIView, GetUserGroup  # 新しいビューをインポート

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('get_user/', get_user, name='get_user'),
    path('accept_invite/', accept_invite, name='accept_invite'),
    path('update_icon/', UpdateIconAPIView.as_view(), name='update_icon'),
    path('get_user_group/', GetUserGroup.as_view(), name='get_user_group'),  # 新しいエンドポイント
]