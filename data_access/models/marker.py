from django.db import models

from .guard_route import GuardRoute


class Marker(models.Model):
    """Модель маркера"""

    name = models.CharField(verbose_name="Название маркера", max_length=50, default="Новый маркер")
    rfid = models.CharField(verbose_name="Номер RFID-карты", max_length=10, blank=False, unique=True)
    route = models.ForeignKey(GuardRoute, verbose_name="Маршрут", on_delete=models.SET_NULL, related_name="markers", blank=True, null=True)

    class Meta:
        db_table = "Markers"
        verbose_name = "Маркер"
        verbose_name_plural = "Маркеры"

    @staticmethod
    def days_range():
        return ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
