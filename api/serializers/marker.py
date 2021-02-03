from rest_framework.serializers import ModelSerializer

# from ..serializers import GuardRouteSerializer

from data_access.models import Marker


class MarkerSerializer(ModelSerializer):
    # route = GuardRouteSerializer(read_only=True)
    
    """Сериализатор для модели маркера"""
    class Meta:
        model = Marker
        fields = ['id', 'name', 'route']
