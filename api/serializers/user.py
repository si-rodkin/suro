from django.contrib.auth.hashers import PBKDF2SHA1PasswordHasher
from rest_framework.serializers import ModelSerializer

from data_access.models import User


class UserSerializer(ModelSerializer):
    """Сериализатор для модели пользователя"""

    class Meta:
        model = User
        # fields = '__all__'
        fields = ['id', 'personnel_number', 'last_name', 'first_name', 'patr_name', 'position', 'phone', 'email',
                  'timezone', 'username', 'avatar', 'is_leading', 'lead', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}
    
    def validate_password(self, value):
        if value is not None:
            return PBKDF2SHA1PasswordHasher().encode(value, 'salt', 180000)
        return None
