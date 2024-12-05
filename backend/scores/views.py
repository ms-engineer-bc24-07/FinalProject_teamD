from rest_framework import generics
from .models import Score
from .serializers import ScoreSerializer

class ScoreListCreate(generics.ListCreateAPIView):
  queryset = Score.objects.all()
  serializer_class = ScoreSerializer