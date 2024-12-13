from django.urls import path
from .views import ReferenceView

urlpatterns = [
    path("upload/", ReferenceView.as_view(), name="file-upload"),
 # referencesアプリのURLパターンを統合
]
