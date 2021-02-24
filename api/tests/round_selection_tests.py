from django.test import TestCase

from ..services.round_service import _get_device_rounds
from data_access.models import Round, Device, Marker

import json
from datetime import datetime


class DeviceRoundSelectionTest(TestCase):
    def setUp(self):
        marker = Marker.objects.create(
            name="Test marker", rfid="1", route=None)
        self.device = Device.objects.create(
            imei="111122223333444", name="Test device")
        self.round = Round.objects.create(marker=marker, device=self.device, name="Test round",
                                          days=datetime.now().isoweekday(), start_time=f'{datetime.now().time().hour}:{datetime.now().time().minute+5}', end_time=None, time_allowance=5, late_time=10)

    def test_that_selection_result_is_a_list(self):
        device_rounds = _get_device_rounds(self.device.imei)
        self.assertIs(type(device_rounds), type([]))

    def test_that_selection_result_is_one_item(self):
        device_rounds = _get_device_rounds(self.device.imei)
        self.assertIs(len(device_rounds), 1)

    def test_that_selected_round_is_a_device_round(self):
        device_rounds = _get_device_rounds(self.device.imei)
        self.assertEqual(device_rounds[0].device.imei, self.device.imei)

    # TODO: проверка временнЫх
    def test_that_selected_round(self):
        Round.objects.create(marker=Marker.objects.create(name="_", rfid="_", route=None), device=self.device, name="Test round",
                             days=(datetime.now().isoweekday()+1) % 7, start_time=datetime.now().time(), end_time=None, time_allowance=5, late_time=10)
        device_rounds = _get_device_rounds(self.device.imei)

        self.assertIs(len(device_rounds), 1)
