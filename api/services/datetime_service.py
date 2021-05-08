import json
from datetime import datetime


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
