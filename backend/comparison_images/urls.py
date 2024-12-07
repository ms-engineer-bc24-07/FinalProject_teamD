# comparison_images/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComparisonImageViewSet

router = DefaultRouter()
router.register(r'comparison-images', ComparisonImageViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
