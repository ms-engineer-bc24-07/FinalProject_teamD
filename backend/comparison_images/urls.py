# comparison_images/urls.py
from django.urls import path
from .views import ComparisonImageDetail, ComparisonImageList

urlpatterns = [
    path('<int:comparison_image_id>/', ComparisonImageDetail.as_view(), name='comparison-image-detail'),  # 比較画像詳細
    path('', ComparisonImageList.as_view(), name='comparison-image-list'),  # 比較画像リスト
]
