import os
from email.mime.image import MIMEImage
from re import sub

from django.core.mail import EmailMessage
from django.template.loader import get_template
from rest_framework.authtoken.models import Token

from diamonds_project import settings
from diamonds_project.settings import EMAIL_HOST_USER
from main.models import Basket, BasketItems


def get_basket_data(request):
    header_token = request.META.get('HTTP_AUTHORIZATION', None)
    if header_token is not None:
        try:
            token = sub('Token ', '', request.META.get('HTTP_AUTHORIZATION', None))
            token_obj = Token.objects.get(key=token)
            request.user = token_obj.user
        except Token.DoesNotExist:
            print("User is undefined")
    basket = Basket.objects.get(user=request.user)
    basket_items = BasketItems.objects.filter(basket=basket)
    return {'basket_items' : basket_items, 'user': request.user}


def get_images(data):
    images = []
    for basket_item in data['basket_items']:
        images.append((str(basket_item.item.image), 'img' + str(basket_item.item.id)))
    return images


def get_message(request, recipient):
    data = get_basket_data(request)
    html_template = get_template('notifications/email.html')
    html_content = html_template.render(data)
    subject = "****Basket****"
    images = get_images(data)
    attachments = []
    for img in images:
        fp = open(os.path.join(settings.MEDIA_ROOT, img[0]), 'rb')
        msg_image = MIMEImage(fp.read(), _subtype="svg")
        fp.close()
        msg_image.add_header('Content-ID', '<' + img[1] + '>')
        attachments.append(msg_image)
    msg = EmailMessage(subject, html_content, EMAIL_HOST_USER, [recipient], attachments=attachments)
    msg.content_subtype = "html"
    return msg


def get_cart_changed(data):
    html_template = get_template('notifications/cart_changed.html')
    html_content = html_template.render(data)
    return html_content