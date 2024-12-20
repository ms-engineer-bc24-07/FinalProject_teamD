from django.urls import path
from .views import ScoreListCreate, ScoreDetail

urlpatterns = [
  path('', ScoreListCreate.as_view(), name='extract-score'),
  path('<int:id>/', ScoreDetail.as_view(), name='score-detail'),  # スコア詳細の取得
]
