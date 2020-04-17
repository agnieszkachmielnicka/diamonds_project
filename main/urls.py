from django.urls import path, include
from main.routers import router
from main.views import BasketItemDetailViewSet, CartStateViewSet, ClearCartViewSet

app_name = 'main'

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/basket_items/<int:pk>/', BasketItemDetailViewSet.as_view()),
    path('api/cart_state/', CartStateViewSet.as_view()),
    path('api/clear_cart/', ClearCartViewSet.as_view())
]