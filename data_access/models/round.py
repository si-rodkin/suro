from django.db import models

from .marker import Marker
from .device import Device

class Round(models.Model):
    """Модель обхода маркера"""
    
    name = models.CharField(verbose_name="Наименование", max_length=50)
    days = models.IntegerField(verbose_name="Дни обхода")
    start_time = models.TimeField(verbose_name="Время начала обхода")
    end_time = models.TimeField(verbose_name="Время окончания обхода", null=True)
    time_allowance = models.IntegerField(verbose_name="Время допуска")
    late_time = models.IntegerField(verbose_name="Время опоздания")

    marker = models.ForeignKey(Marker, verbose_name="Маркер", on_delete=models.CASCADE, related_name="rounds", null=True)
    device = models.ForeignKey(Device, verbose_name="Устройство", on_delete=models.CASCADE, related_name="rounds")

    class Meta:
        verbose_name = "Обход"
        verbose_name_plural = "Обходы"

    def __str__(self):
        return self.name
