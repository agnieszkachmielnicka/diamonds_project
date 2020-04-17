import smtplib

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from notifications.create_template import get_message


class ShareViewSet(APIView):

    def post(self, request):
        recipient = request.data['email']
        message = get_message(request, recipient)
        try:
            message.send(fail_silently=False)
        except smtplib.SMTPException:
            print("The email was't sent")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)
