from datetime import datetime

from data_access.models import Device, Commit, Marker, Round

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
    commit.date = datetime(year=(2000 + body[4]), month=body[3], day=body[2], hour=body[0], minute=body[1])
    commit.round = Round.objects.get(pk=roundId)
    commit.save()
    return []


def get_all_commits() -> []:
    return Commit.objects.all()


def get_planned_commits() -> []:
    return Commit.objects.raw('SELECT * FROM Commits c WHERE (SELECT marker_id FROM Rounds WHERE c.round_id = id) = c.marker_id')


def get_unplanned_commits() -> []:
    return Commit.objects.raw('SELECT * FROM Commits c WHERE (SELECT marker_id FROM Rounds WHERE c.round_id = id) <> c.marker_id')


def get_missed_commits() -> []:
    return Commit.objects.raw('SELECT * FROM Commits c WHERE c.marker_id is null')
