from rest_framework import serializers


class ShareSerializer(serializers.Serializer):
    email = serializers.EmailField()