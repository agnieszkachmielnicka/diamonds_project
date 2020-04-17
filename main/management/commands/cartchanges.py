import smtplib

from django.core.mail import mail_admins
from django.core.management.base import BaseCommand

from main.models import Basket
from notifications.create_template import get_cart_changed


class Command(BaseCommand):
    help = 'Sending email about cart changes'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def handle(self, *args, **options):
        baskets = Basket.objects.filter(has_changed=True)
        data = {'baskets': baskets}
        html_content = get_cart_changed(data)
        subject = "***Changes are detected***"
        try:
            mail_admins(subject, message=None, fail_silently=False, html_message=html_content)
        except smtplib.SMTPException:
            print("The email was't sent")
        for basket in baskets:
            basket.has_changed = False
            basket.save()