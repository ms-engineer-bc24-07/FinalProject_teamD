from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ImageModel
from .serializers import ImageModelSerializer

class ImageUploadView(APIView):
    def post(self, request, *args, **kwargs):
        file_serializer = ImageModelSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.