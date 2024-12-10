# references/urls.py
from django.urls import path
from .views import ReferenceDetail
from .views import ReferenceList

urlpatterns = [
    path('', ReferenceList.as_view(), name='reference-list'),
    path('<int:reference_id>/', ReferenceDetail.as_view(), name='reference-detail'),  # 'api/references/<int:reference_id>/' に対応
]
