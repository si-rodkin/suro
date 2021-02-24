import json
from datetime import datetime, timedelta

from data_access.models import Device, Round

from django.db.models import Q


def get_current_route(device_imei: str) -> str:
    """Вернуть маркеры, которые должны быть пройдены данным устройством
    в течении следующих 30ти минут

    Args:
        device_imei (str): IMEI запрашивающего устройства

    Returns:
        str: json-структура, содержащее поле marker_count (кол-во маркеров) и поле markers: массив времен

    Example:
        {
            'marker_count': 3,
            'markers': [
                { 'start_time': '10:10', 'id': '1' },
                { 'start_time': '12:10', 'id': '2' },
                { 'start_time': '14:10', 'id': '3' }
            ]
        }
    """

    rounds = _get_device_rounds(device_imei)

    response = {}
    response['marker_count'] = len(rounds)
    response['markers'] = []
    for marker in rounds:
        response['markers'].append({'start_time': str(marker.start_time)})
        response['markers'].append({'id': str(marker.id)})
    return json.dumps(response)


def _get_device_rounds(imei: str):
    now = datetime.now()
    limit = now + timedelta(hours=1)

    device = Device.objects.get(imei=imei)
    rounds = Round.objects\
        .filter(device=device.id)\
        .filter(Q(days=(limit.isoweekday() - 1)) | Q(days=limit.isoweekday()))\
        .filter(Q(start_time__gte=now) & Q(start_time__lte=limit))

    return list(rounds)
