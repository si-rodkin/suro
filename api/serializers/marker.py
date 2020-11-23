from rest_framework.serializers import ModelSerializer

from data_access.models import Marker


class MarkerSerializer(ModelSerializer):
    """Сериализатор для модели маркера"""
    class Meta:
        model = Marker
        fields = ['id', 'name']
