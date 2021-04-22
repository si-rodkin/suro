import json
from datetime import datetime, timedelta

from data_access.models import Device, Commit, Marker, GuardRoute, Round
from eye_of_sauron.settings import BYTEORDER, API_COMMANDS


def get_current_datetime() -> str:
    """Вернуть текущие время и дату сервера

    Returns:
        str: json-структура с полем time, содержащем время сервера

    Example:
        {
            'time': '2020-11-07 10:39:31.347083',
            'weekday': '1'
        }
    """
    response = {'time': str(datetime.now()), 'weekday': str(datetime.now().weekday())}
    return json.dumps(response)

def read_commit(imei: str, rfid: str, roundId: str, body) -> []:
    """Зафиксировать отметку маркера устройством

    Args:
        imei (str): IMEI устройства
        rfid (str): RFID посещенной метки
        roundId (str): Идентификатор обхода
        body (bytes): 5 байт даты-времени в формате (чч мм дд ММ гг)
    """
    commit = Commit()
    commit.marker = Marker.objects.get(rfid=rfid)
    commit.device = Device.objects.get(imei=imei)
    commit.date = datetime(year=(2000+body[4)), month=body[3], day=body[2], hour=body[0], minute=body[1])
    commit.round = Round.objects.get(pk=roundId)
    commit.save()
    return [to_byte(API_COMMANDS['ReadCommit'])]


def to_byte(number: int) -> bytes:
    """Привести число в байтовый вид

    Args:
        number (int): исходное число

    Returns:
        bytes: исходное число в виде массива байт
    """
    return number.to_bytes(1, byteorder=BYTEORDER)


def from_byte(byte: bytes) -> int:
    """Привести массив байт в к виду десятичного числа

    Args:
        byte (bytes): число в виде массива байт

    Returns:
        int: десятичное число
    """
    return int.from_bytes(byte, byteorder=BYTEORDER)
