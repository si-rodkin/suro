import json
from datetime import datetime, timedelta

from data_access.models import Device, Round

from django.db.models import Q


def get_current_route(device_imei: str, limit=None) -> str:
    """Вернуть маркеры, которые должны быть пройдены данным устройством
    в течении следующих 30ти минут

    Args:
        device_imei (str): IMEI запрашивающего устройства

    Returns:
        str: json-структура, содержащее поле marker_count (кол-во маркеров) и поле markers: массив времен

    Example:
        {
            'marker_count': 3,
            'begins_count': 1,
            'markers': [
                { 'start_time': '10:10', 'id': '1', 'name': 'Угол 1' },
                { 'start_time': '12:10', 'id': '2', 'name': 'Угол 2' },
                { 'start_time': '14:10', 'id': '3', 'name': 'Угол 3' }
            ],
            round_begins: [
                {'start_time': '10:00'}
            ]
        }
    """

    nearest_rounds = _get_device_nearest_rounds(device_imei, limit)
    round_begins = _get_device_rounds_begins(device_imei)

    response = {}
    response['marker_count'] = len(nearest_rounds)
    response['begins_count'] = len(round_begins)
    response['markers'] = []
    response['round_begins'] = []
    for marker in nearest_rounds:
        response['markers'].append({
            'start_time': str(marker.start_time),
            'id': str(marker.id),
            'name': marker.marker.name
        })


    for round_begin in round_begins:
        response['round_begins'].append({'start_time': str(round_begin.start_time)})

    return json.dumps(response)


def _get_device_nearest_rounds(imei: str, limit):
    now = datetime.now()
    timeBound = Q(days=now.isoweekday() - 1)

    if limit != None and limit != '':
        limit = now + timedelta(hours=int(limit))
        """Ограничение на время по умолчанию: если выборка в пределах дня"""
        timeBound = Q(days=now.isoweekday() - 1) & Q(start_time__gte=now) & Q(start_time__lte=limit)
        """Если выборка затрагивает два дня, то
            1. выбираем обходы, которые остались в этом дне
            2. выбираем обходы, которые будут в следующем дне с временем начала не позднее верхней границы выборки
        """
        if now.isoweekday() != limit.isoweekday():
            timeBound = Q(days=now.isoweekday() - 1) | (Q(days=now.isoweekday()) & Q(start_time__lte=limit))

    device = Device.objects.get(imei=imei)
    rounds = Round.objects\
        .filter(device=device.id)\
        .filter(timeBound)\
        .exclude(marker=None)

    return list(rounds)


def _get_device_rounds_begins(imei):
    device = Device.objects.get(imei=imei)
    return list(Round.objects
                .filter(device=device.id)
                .filter(marker=None)
                .filter(days=(datetime.now().isoweekday() - 1)))
