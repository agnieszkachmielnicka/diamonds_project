from django.urls import path, include
from main.routers import router

app_name = 'main'

urlpatterns = [
    path('api/', include(router.urls)),
]