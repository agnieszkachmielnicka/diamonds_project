from rest_framework import routers
from main import views

router = routers.DefaultRouter()
router.register(r'shapes', views.ShapeViewSet)
router.register(r'baskets', views.BasketViewSet)
