from django.contrib.auth.models import User
from rest_framework import serializers
from main.models import Shape, Basket


class ShapeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Shape
        fields = ('image', 'type')


class BasketSerializer(serializers.ModelSerializer):

    user = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())

    class Meta:
        model = Basket
        fields = ('id', 'user', 'items')
