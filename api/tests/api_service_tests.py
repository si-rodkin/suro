from datetime import datetime

from django.test import TestCase

from api import services
from api.services import from_byte
from data_access.models import Device, Marker, GuardRoute, Commit
from eye_of_sauron.settings import API_COMMANDS


class APIServiceTest(TestCase):
    """Тесты API-сервиса"""

    device = Device(imei='0000000000000001', name='Test', phone='+79008007001')
    route = GuardRoute(name='Test')
    marker = Marker(rfid='001', days=7, start_time=datetime.now().time(), end_time=None, time_allowance=0, late_time=0,
                    route=route)
    commit_hour = b'\x01'
    commit_minute = b'\x02'

    def _prepare(self):
        self.device.save()
        self.route.save()
        self.route.devices.set([self.device])
        self.route.save()
        self.marker.save()

    """Тестовый тест"""
    def test_nothing(self):
        self.assertIs(True, True)

    """Тест получения текущего времени сервера"""
    def test_get_current_datetime(self):
        response = services.get_current_datetime()

        self.assertEqual(from_byte(response[0]), API_COMMANDS['SyncDateTime'])
        self.assertEqual(from_byte(response[1]), datetime.now().hour)
        self.assertEqual(from_byte(response[2]), datetime.now().minute)

    """Тест фиксации факта чтения метки"""
    def test_read_commit(self):
        self._prepare()
        response = services.read_commit(self.device.imei, self.marker.rfid, self.commit_hour, self.commit_minute)
        commit = Commit.objects.get(device=self.device)

        self.assertEqual(from_byte(response[0]), API_COMMANDS['ReadCommit'])
        self.assertEqual(commit.date.hour, from_byte(self.commit_hour))
        self.assertEqual(commit.date.minute, from_byte(self.commit_minute))
