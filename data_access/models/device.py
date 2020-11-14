from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class Device(models.Model):
    """Модель устройства"""
    imei = models.CharField(verbose_name="IMEI", null=False, blank=False, unique=True, max_length=17, db_index=True)
    name = models.CharField(verbose_name="Имя устройства", null=False, blank=False, unique=True, max_length=128)
    phone = PhoneNumberField(verbose_name="Номер GSM-модуля", null=False, blank=False, unique=True, db_index=True)

    class Meta:
        verbose_name = "Устройство"
        verbose_name_plural = "Устройства"
