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
