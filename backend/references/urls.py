# references/urls.py
from django.urls import path
from .views import ReferenceDetail

urlpatterns = [
    path('<int:reference_id>/', ReferenceDetail.as_view(), name='reference-detail'),  # 'api/references/<int:reference_id>/' に対応
]
