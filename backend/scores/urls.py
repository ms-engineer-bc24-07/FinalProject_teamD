from django.urls import path
from .views import ScoreListCreate

urlpatterns = [
  path('score/', ScoreListCreate.as_view(), name='extract-score'),
]