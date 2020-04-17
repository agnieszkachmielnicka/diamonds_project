from django.contrib.auth.models import User
from rest_framework import serializers
from main.models import Shape, Basket, BasketItems
from re import sub
from rest_framework.authtoken.models import Token


class ShapeSerializer(serializers.ModelSerializer):

    quantity = serializers.SerializerMethodField()

    class Meta:
        model = Shape
        fields = ('id', 'image', 'type', 'quantity')

    def get_quantity(self, obj):
        print(self.context)
        request = self.context['request']
        header_token = request.META.get('HTTP_AUTHORIZATION', None)
        if header_token is not None:
            try:
                token = sub('Token ', '', request.META.get('HTTP_AUTHORIZATION', None))
                token_obj = Token.objects.get(key=token)
                request.user = token_obj.user
            except Token.DoesNotExist:
                pass
            try:
                basket = Basket.objects.get(user=request.user)
                basket_item = BasketItems.objects.get(item=obj, basket=basket)
            except (BasketItems.DoesNotExist, Basket.DoesNotExist):
                return None
            return basket_item.quantity
        return None


class BasketSerializer(serializers.ModelSerializer):

    user = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    items = ShapeSerializer(read_only=True, many=True)

    class Meta:
        model = Basket
        fields = ('id', 'user', 'items')


class BasketItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = BasketItems
        fields = ('item', 'basket', 'quantity')
        read_only_fields = ('basket', '')