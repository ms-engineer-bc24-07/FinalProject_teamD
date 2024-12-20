# comparison_images/serializers.py
from rest_framework import serializers
from comparison_images.models import ComparisonImage

class ComparisonImageSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.user_name') 


    class Meta:
        model = ComparisonImage
        fields = ['id', 'reference', 'image_url', 'user_name', 'uploaded_at']  # 必要なフィールドを指定
