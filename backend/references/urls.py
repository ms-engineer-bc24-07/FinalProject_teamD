# references/urls.py
from django.urls import path
from .views import ReferenceDetail , ReferenceList , ReferenceView , GroupReferencesView



urlpatterns = [
    path('', ReferenceList.as_view(), name='reference-list'),
    path('<int:reference_id>/', ReferenceDetail.as_view(), name='reference-detail'),  # 'api/references/<int:reference_id>/' に対応
    path('upload/', ReferenceView.as_view(), name="file-upload"),
    path('group-references/', GroupReferencesView.as_view(), name='group-references'),

]


