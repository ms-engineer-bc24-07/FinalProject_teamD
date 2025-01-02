# references/urls.py
from django.urls import path
from .views import ReferenceDetail
# from .views import ReferenceList
from .views import ReferenceView
from .views import fetch_references

urlpatterns = [
    path('fetch_references/', fetch_references, name='fetch_references'),
    path('<int:reference_id>/', ReferenceDetail.as_view(), name='reference-detail'),  # 'api/references/<int:reference_id>/' に対応
    path('upload/', ReferenceView.as_view(), name="file-upload"),
]


