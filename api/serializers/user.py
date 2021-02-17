from rest_framework.serializers import ModelSerializer

from data_access.models import User


class UserSerializer(ModelSerializer):
    """Сериализатор для модели пользователя"""
    class Meta:
        model = User
        # fields = '__all__'
        fields = ['id', 'personnel_number', 'last_name', 'first_name', 'patr_name', 'position', 'phone', 'email', 'timezone', 'username', 'avatar']
