# comparison_images/urls.py
from django.urls import path
from .views import ComparisonImageDetailView, ComparisonImageListView

urlpatterns = [
    path('<int:pk>/', ComparisonImageDetailView.as_view(), name='comparison-image-detail'),  # 比較画像詳細
    path('', ComparisonImageListView.as_view(), name='comparison-image-list'),  # 比較画像リスト
]
