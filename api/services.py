# TODO: вынести эти функции в модуль services
from datetime import datetime, time

from data_access.models import Device, Commit, Marker
from eye_of_sauron.settings import BYTEORDER, API_COMMANDS


def get_current_datetime() -> []:
    response = [to_byte(API_COMMANDS['SyncDateTime'])]
    now = datetime.now()
    response.append(to_byte(now.hour))
    response.append(to_byte(now.minute))
    response.append(to_byte(now.second))
    response.append(to_byte(now.day))
    response.append(to_byte(now.month))
    response.append(to_byte(now.year % 1000))
    response.append(to_byte(now.weekday()))
    return response


def get_current_route(device_imei: str) -> []:
    response = [to_byte(API_COMMANDS['SyncDeviceRoute'])]
    now = datetime.now()

    device = Device.objects.get(imei=device_imei)
    routes = device.routes.all()
    current_markers = []
    for route in routes:
        delta = 100
        markers = route.markers.order_by('start_time')
        if markers[0].start_time < now.time() < markers[len(markers) - 1].start_time:
            current_markers = markers
            break
        # FIXME: i think, it's a wrong way
        if route.markers[0].start_time > now.time():
            if delta > (markers[0].start_time - now.time()):
                delta = (markers[0].start_time - now.time())
                current_markers = markers

    for marker in current_markers:
        response.append(to_byte(marker.start_time.minute))
        response.append(to_byte(marker.start_time.hour))
    return response


def read_commit(imei: str, rfid: str, hour: bytes, minute: bytes) -> []:
    commit = Commit()
    commit.marker = Marker.objects.get(rfid=rfid)
    commit.device = Device.objects.get(imei=imei)
    commit.date = time(from_byte(hour), from_byte(minute))
    commit.save()
    return [to_byte(API_COMMANDS['ReadCommit'])]


def to_byte(number: int) -> bytes:
    return number.to_bytes(1, byteorder=BYTEORDER)


def from_byte(byte: bytes) -> int:
    return int.from_bytes(byte, byteorder=BYTEORDER)
