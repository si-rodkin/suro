import json
from datetime import datetime, time, timedelta

from data_access.models import Device, Commit, Marker, GuardRoute, Round
from eye_of_sauron.settings import BYTEORDER, API_COMMANDS


def get_current_datetime() -> str:
    """Вернуть текущие время и дату сервера

    Returns:
        str: json-структура с полем time, содержащем время сервера

    Example:
        {
            'time': '2020-11-07 10:39:31.347083'
        }
    """
    response = {'time': str(datetime.now())}
    return json.dumps(response)

def read_commit(imei: str, rfid: str, roundId: str, hour: bytes, minute: bytes) -> []:
    """Зафиксировать отметку маркера устройством

    Args:
        imei (str): IMEI устройства
        rfid (str): RFID посещенной метки
        roundId (str): Идентификатор обхода
        hour (bytes): Час посещения метки в байтовом виде
        minute (bytes): Минуты посещения метки в байтовом виде
    """
    commit = Commit()
    commit.marker = Marker.objects.get(rfid=rfid)
    commit.device = Device.objects.get(imei=imei)
    commit.date = time(from_byte(hour), from_byte(minute))
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
