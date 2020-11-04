from django.db import models

from .guard_route import GuardRoute


class Marker(models.Model):
    """Модель маркера"""
    rfid = models.CharField(verbose_name="Номер RFID-карты", max_length=10, null=False, blank=False, unique=True,
                            primary_key=True)
    days = models.IntegerField(verbose_name="Дни обхода", null=False)
    start_time = models.TimeField(verbose_name="Время начала обхода", null=False)
    end_time = models.TimeField(verbose_name="Время окончания обхода", null=True)
    time_allowance = models.IntegerField(verbose_name="Время допуска", null=False)
    late_time = models.IntegerField(verbose_name="Время опоздания", null=False)
    route = models.ForeignKey(GuardRoute, verbose_name="Маршрут", on_delete=models.SET_NULL, related_name="markers",
                              null=True)

    class Meta:
        verbose_name = "Маркер"

    @staticmethod
    def days_range():
        return ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
