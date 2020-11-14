from django.db import models


class GuardedObject(models.Model):
    """Модель охраняемого объекта"""
    name = models.CharField(verbose_name="Наименование объекта", null=False, blank=False, unique=True, max_length=64)
    itn = models.CharField(verbose_name="Индивидуальный номер налогоплательщика", null=False, blank=False, unique=True,
                           max_length=10)

    class Meta:
        verbose_name = "Охраняемый объект"
        verbose_name_plural = "Охраняемые объекты"
