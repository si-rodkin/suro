from rest_framework.serializers import ModelSerializer

from data_access.models import Device


class DeviceSerializer(ModelSerializer):
    """Сериализатор для модели устройства"""
    class Meta:
        model = Device
        fields = ['id', 'imei', 'name', 'phone', 'guard_routes']
