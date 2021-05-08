from rest_framework.serializers import ModelSerializer

from data_access.models import Marker
from .guard_route import GuardRouteSerializer


class MarkerSerializer(ModelSerializer):
    route = GuardRouteSerializer(read_only=True)

    """Сериализатор для модели маркера"""

    class Meta:
        model = Marker
        # fields = ['id', 'name', 'route', 'routeName', 'rfid']
        fields = "__all__"
