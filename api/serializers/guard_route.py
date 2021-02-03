from rest_framework.serializers import ModelSerializer

from data_access.models import GuardRoute


class GuardRouteSerializer(ModelSerializer):
    """Сериализатор для модели маршрута охраны"""
    class Meta:
        model = GuardRoute
        # fields = '__all__'
        fields = ['id', 'name', 'guard_object', 'markers', 'devices']
