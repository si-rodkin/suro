from rest_framework.serializers import ModelSerializer

from data_access.models import Round


class RoundSerializer(ModelSerializer):
    """Сериализатор для модели обхода маркера"""
    class Meta:
        model = Round
        fields = '__all__'
        # fields = ['id', 'days', 'start_time', 'end_time', 'late_time', 'time_allowance', 'marker', 'device']
