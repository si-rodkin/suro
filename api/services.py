import json
from datetime import datetime, time

from data_access.models import Device, Commit, Marker
from eye_of_sauron.settings import BYTEORDER, API_COMMANDS


def get_current_datetime() -> str:
    response = { 'time': str(datetime.now()) }
    return json.dumps(response)

# {
#   'time': '2020-11-07 10:39:31.347083'
# }


def get_current_route(device_imei: str) -> str:
    response = {}
    now = datetime.now()

    device = Device.objects.get(imei=device_imei)
    routes = device.guard_routes.all()
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

    response['marker_count'] = len(current_markers)
    response['markers'] = []
    for marker in current_markers:
        response['markers'].append({'start_time': str(marker.start_time)})
    return json.dumps(response)

# {
#   'marker_count': 3,
#   'markers': [
#       { 'start_time': '10:10' },
#       { 'start_time': '12:10' },
#       { 'start_time': '14:10' },
#   ]
# }


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
