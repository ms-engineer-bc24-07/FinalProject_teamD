# references/views.py
from rest_framework import viewsets
from .models import Reference
from .serializers import ReferenceSerializer

class ReferenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Reference.objects.all()
    serializer_class = ReferenceSerializer

