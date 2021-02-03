from django.db import models

from .guarded_object import GuardedObject
from .device import Device


class GuardRoute(models.Model):
    """Модель маршрута охраны"""
    name = models.CharField(verbose_name="Наименование", null=False, blank=False, unique=True, max_length=128)
    guard_object = models.ForeignKey(GuardedObject, verbose_name="Охраняемый объект", on_delete=models.CASCADE,
                                     related_name="guard_routes")
    devices = models.ManyToManyField(Device, verbose_name="Устройство обхода", related_name="guard_routes", blank=True)

    class Meta:
        verbose_name = "Маршрут охраны"
        verbose_name_plural = "Маршруты охраны"

    def __str__(self):
        return 'Маршрут: ' + self.name.__str__()
