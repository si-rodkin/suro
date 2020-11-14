from django.db import models

from .guard_route import GuardRoute


class Marker(models.Model):
    """Модель маркера"""
    rfid = models.CharField(verbose_name="Номер RFID-карты", max_length=10, blank=False, unique=True, primary_key=True)
    route = models.ForeignKey(GuardRoute, verbose_name="Маршрут", on_delete=models.SET_NULL, related_name="markers", null=True)

    class Meta:
        verbose_name = "Маркер"
        verbose_name_plural = "Маркеры"

    @staticmethod
    def days_range():
        return ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
