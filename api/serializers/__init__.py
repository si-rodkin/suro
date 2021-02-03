from .user import UserSerializer
from .round import RoundSerializer
from .marker import MarkerSerializer
from .device import DeviceSerializer
from .guard_route import GuardRouteSerializer
from .guarded_object import TheRingSerializer
from .commit import CommitSerializer

from rest_framework.authentication import SessionAuthentication


# Костылим проверку CSRF-токена
# FIXME: убрать это отсюда
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening
