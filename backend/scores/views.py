# scores/views.py
from rest_framework import viewsets
from .models import Score
from .serializers import ScoreSerializer

class ScoreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
