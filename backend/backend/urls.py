# backend/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/references/', include('references.urls')),  # 既存の設定
    path('api/scores/', include('scores.urls')),  # scores APIの設定
    path('api/comparison-images/', include('comparison_images.urls')),  # comparison-images APIの設定
    path('api/users/', include('users.urls')),  # users アプリのAPIエンドポイント
]

