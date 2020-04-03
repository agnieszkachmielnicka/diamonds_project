from django.urls import path, include
from main.routers import router
from main.views import BasketItemDetailViewSet

app_name = 'main'

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/basket_items/<int:pk>/', BasketItemDetailViewSet.as_view()),
]