from re import sub

from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView

from main.models import Shape, Basket, BasketItems
from main.serializers import ShapeSerializer, BasketSerializer, BasketItemSerializer


class ShapeViewSet(viewsets.ModelViewSet):

    serializer_class = ShapeSerializer
    queryset = Shape.objects.all()


class BasketViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated]

    serializer_class = BasketSerializer
    queryset = Basket.objects.all()
    lookup_field = 'user__username'


class BasketItemDetailViewSet(APIView):

    def get_or_create(self, basket, item):
        try:
            basket_item = BasketItems.objects.get(basket=basket, item=item)
            return basket_item
        except BasketItems.DoesNotExist:
            return BasketItems(basket=basket, item=item, quantity=0)

    def post(self, request, pk, format=None):
        item = Shape.objects.get(id=request.data['item'])
        basket = Basket.objects.get(id=pk)
        basket_item = self.get_or_create(basket, item)
        basket_item.quantity += 1
        request.data['quantity'] = basket_item.quantity
        serializer = BasketItemSerializer(basket_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            basket.has_changed = True
            basket.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        item = Shape.objects.get(id=request.data['item'])
        basket = Basket.objects.get(id=pk)
        basket_item = self.get_or_create(basket, item)
        basket.has_changed = True
        basket.save()
        if request.data['delete_forever']:
            basket_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        basket_item.quantity -= 1
        request.data['quantity'] = basket_item.quantity
        serializer = BasketItemSerializer(basket_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CartStateViewSet(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        header_token = request.META.get('HTTP_AUTHORIZATION', None)
        if header_token is not None:
            try:
                token = sub('Token ', '', request.META.get('HTTP_AUTHORIZATION', None))
                token_obj = Token.objects.get(key=token)
                user = token_obj.user
            except Token.DoesNotExist:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            basket = Basket.objects.get(user=user)
            request.data['user'] = user
            serializer = BasketSerializer(basket, context={'request': request})
            return Response(serializer.data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class ClearCartViewSet(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request):
        header_token = request.META.get('HTTP_AUTHORIZATION', None)
        if header_token is not None:
            try:
                token = sub('Token ', '', request.META.get('HTTP_AUTHORIZATION', None))
                token_obj = Token.objects.get(key=token)
                user = token_obj.user
            except Token.DoesNotExist:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            basket = Basket.objects.get(user=user)
            BasketItems.objects.filter(basket=basket).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_401_UNAUTHORIZED)
