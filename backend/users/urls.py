from django.urls import path
from .views import RegisterUserView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register_user'),
]

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register_user'),
    path('<str:uid>/', GetUserView.as_view(), name='get_user'),
]
