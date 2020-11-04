from rest_framework.serializers import ModelSerializer

from data_access.models import Marker


class MarkerSerializer(ModelSerializer):
    """Сериализатор для модели маркера"""
    class Meta:
        model = Marker
        fields = ['rfid', 'days', 'start_time', 'end_time', 'time_allowance', 'late_time', 'route']
