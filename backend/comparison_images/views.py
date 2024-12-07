# comparison_images/views.py
from rest_framework import viewsets
from .models import ComparisonImage
from .serializers import ComparisonImageSerializer

class ComparisonImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ComparisonImage.objects.all()
    serializer_class = ComparisonImageSerializer
