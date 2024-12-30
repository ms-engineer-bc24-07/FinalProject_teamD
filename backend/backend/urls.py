# backend/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/references/', include('references.urls')),  # references アプリ
    path('api/scores/', include('scores.urls')),          # scores アプリ
    path('api/comparison-images/', include('comparison_images.urls')),  # comparison-images アプリ
    path('api/users/', include('users.urls')),            # users アプリ
    path('api/family/', include('family.urls')),          # family アプリ
]
