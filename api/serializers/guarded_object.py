from rest_framework.serializers import ModelSerializer

from data_access.models import GuardedObject


class TheRingSerializer(ModelSerializer):
    """Сериализатор для модели охраняемого объекта"""
    class Meta:
        model = GuardedObject
        fields = ['name', 'itn']
