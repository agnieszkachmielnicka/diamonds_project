from django.urls import path, include
from rest_auth.registration.views import RegisterView
from rest_auth.views import LoginView

from . import views


urlpatterns = [
    path('', views.index),
    path('rest-auth/login/', LoginView.as_view(), name="rest_login"),
    path('rest-auth/registration/', RegisterView.as_view(), name="rest_register"),
]