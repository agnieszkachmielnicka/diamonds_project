from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView

from main.models import Shape, Basket, BasketItems
from main.serializers import ShapeSerializer, BasketSerializer, BasketItemSerializer


class ShapeViewSet(viewsets.ModelViewSet):

    serializer_class = ShapeSerializer
    queryset = Shape.objects.all()


class BasketViewSet(viewsets.ModelViewSet):

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
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, format=None):
        item = Shape.objects.get(id=request.data['item'])
        basket = Basket.objects.get(id=pk)
        basket_item = self.get_or_create(basket, item)
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
