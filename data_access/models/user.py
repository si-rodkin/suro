from django.contrib.auth.models import AbstractUser as DjangoUserModel
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class User(DjangoUserModel):
    """
    Модель пользователя системы
    """
    personnel_number = models.IntegerField(verbose_name="Табельный номер", null=True)
    patr_name = models.CharField(verbose_name="Отчество", max_length=32, null=True, blank=True)
    position = models.CharField(verbose_name="Должность", null=False, blank=False, max_length=128)
    phone = PhoneNumberField(verbose_name="Телефонный номер", null=False, blank=False, unique=True, db_index=True)
    timezone = models.CharField(verbose_name="Часовой пояс", null=False, blank=False, max_length=32, default="Europe/Moscow")
    avatar = models.ImageField(verbose_name="Аватар пользователя", null=True, blank=True)
    is_leading = models.BooleanField(verbose_name="Является ли управленцем", default=False)
    lead = models.ForeignKey("self", verbose_name="Руководитель", null=True, on_delete=models.CASCADE)
    
    class Meta:
        db_table = "Users"
        verbose_name = "Пользователь системы"
        verbose_name_plural = "Пользователи системы"
