from django.db import models


class Shape(models.Model):
    image = models.FileField(upload_to='shapes/')
    type = models.CharField(max_length=5)


class Basket(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    items = models.ManyToManyField(Shape, through="BasketItems", blank=True)
    has_changed = models.BooleanField(default=False)


class BasketItems(models.Model):
    item = models.ForeignKey(Shape, on_delete=models.CASCADE)
    basket = models.ForeignKey(Basket, on_delete=models.CASCADE)
    quantity = models.IntegerField()
