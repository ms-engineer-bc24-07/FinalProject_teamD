from rest_framework import serializers
from .models import Reference

class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference

        fields = ['id', 'reference_name', 'image_url', 'user', 'image']
