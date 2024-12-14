from django.urls import path
from .views import send_invite, accept_invite

urlpatterns = [
    path('send_invite/', send_invite, name='send_invite'),
    path('accept_invite/', accept_invite, name='accept_invite'),
]
