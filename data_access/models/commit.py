from django.db import models

from .device import Device
from .marker import Marker


class Commit(models.Model):
    """Модель данных для синхронизации с устройством"""
    device = models.ForeignKey(Device, on_delete=models.DO_NOTHING)
    marker = models.ForeignKey(Marker, on_delete=models.DO_NOTHING)
    date = models.TimeField(verbose_name="Дата обмена информацией")

    class Meta:
        verbose_name = "Синхронизация с устройством"
