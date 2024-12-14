from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from references.models import Reference
from references.serializers import ReferenceSerializer

class ReferenceDetail(APIView):
    def get(self, request, reference_id):
        try:
            reference = Reference.objects.get(id=reference_id)
            serializer = ReferenceSerializer(reference)
            return Response(serializer.data)
        except Reference.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

class ReferenceList(APIView):
    def get(self, request):
        references = Reference.objects.all()
        serializer = ReferenceSerializer(references, many=True)
        return Response(serializer.data)


class ReferenceView(APIView):
    def post(self, request, *args, **kwargs):
        file_serializer = ReferenceSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.