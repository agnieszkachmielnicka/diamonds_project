from django.contrib.auth.models import User
from rest_framework import serializers
from main.models import Shape, Basket, BasketItems


class ShapeSerializer(serializers.ModelSerializer):

    quantity = serializers.SerializerMethodField()

    class Meta:
        model = Shape
        fields = ('id', 'image', 'type', 'quantity')

    def get_quantity(self, obj):
        try:
            basket_item = BasketItems.objects.get(item=obj)
        except BasketItems.DoesNotExist:
            return None
        return basket_item.quantity


class BasketSerializer(serializers.ModelSerializer):

    user = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    items = ShapeSerializer(read_only=True, many=True)

    class Meta:
        model = Basket
        fields = ('user', 'items')

