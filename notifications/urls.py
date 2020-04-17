from django.urls import path, include
from notifications import views


app_name = 'notifications'

urlpatterns = [
    path('api/share/', views.ShareViewSet.as_view()),
]