from django.urls import path
from .views import get_data, send_email_view

urlpatterns = [
    path('data/', get_data, name='get_data'),
    path('send-email/', send_email_view, name='send_email'),
]
