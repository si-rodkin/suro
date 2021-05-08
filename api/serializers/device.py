from rest_framework.serializers import ModelSerializer

from data_access.models.device import Device, State


class DeviceSerializer(ModelSerializer):
    """Сериализатор для модели устройства"""

    class Meta:
        model = Device
        fields = ['id', 'imei', 'name', 'phone', 'guard_routes']


class StateSerializer(ModelSerializer):
    """Сериализатор модели состояния устройства"""

    class Meta:
        model = State
        fields = '__all__'
