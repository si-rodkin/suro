from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class Device(models.Model):
    """Модель устройства"""
    imei = models.CharField(verbose_name="IMEI", null=False, blank=False, unique=True, max_length=17, db_index=True)
    name = models.CharField(verbose_name="Имя устройства", null=False, blank=False, unique=True, max_length=128)
    phone = PhoneNumberField(verbose_name="Номер GSM-модуля", null=False, blank=False, unique=True, db_index=True)

    class Meta:
        db_table = "Devices"
        verbose_name = "Устройство"
        verbose_name_plural = "Устройства"


# class State(models.Model):
#     """Модель статистики состояния устройства"""

#     device = models.ForeignKey(Device, on_delete=models.CASCADE)

#     isOpened = models.BooleanField(verbose_name="Было ли вскрытие")
#     batteryLevel = models.IntegerField(verbose_name="Уровень заряда батареи")

#     class Meta:
#         db_table = "DeviceStates"
#         verbose_name = "Состояние устройство"
#         verbose_name_plural = "Состояния устройств"
