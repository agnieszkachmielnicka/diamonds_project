from django.contrib.auth.models import User
from rest_framework import viewsets
from main.models import Shape, Basket, BasketItems
from main.serializers import ShapeSerializer, BasketSerializer


class ShapeViewSet(viewsets.ModelViewSet):

    serializer_class = ShapeSerializer
    queryset = Shape.objects.all()


class BasketViewSet(viewsets.ModelViewSet):

    serializer_class = BasketSerializer
    queryset = Basket.objects.all()
    lookup_field = 'user__username'


