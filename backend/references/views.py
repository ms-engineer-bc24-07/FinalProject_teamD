from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Reference
from .serializers import ReferenceSerializer
from .upload import upload_to_s3
from django.core.files.storage import FileSystemStorage

class ReferenceView(APIView):
    def put(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('image')
        fs = FileSystemStorage() 
        filename = fs.save(uploaded_file.name, uploaded_file) 
        file_url = fs.url(filename) # URLとしてアクセス可能なパス 
        file_path = fs.path(filename)
        if upload_to_s3(file_path,filename):
              print("Upload succeeded.")
              return Response(None, status=status.HTTP_201_CREATED)
        else:
              print("Upload failed.")
              return Response(None, status=status.HTTP_400_BAD_REQUEST)
    def post(self, request, *args, **kwargs):
        file_serializer = ReferenceSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.