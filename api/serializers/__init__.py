from rest_framework.authentication import SessionAuthentication

from .commit import CommitSerializer
from .device import DeviceSerializer, StateSerializer as DeviceStateSerializer
# from .guard_route import GuardRouteSerializer
from .guarded_object import TheRingSerializer
from .marker import MarkerSerializer, GuardRouteSerializer
from .round import RoundSerializer
from .user import UserSerializer


# Костылим проверку CSRF-токена
# FIXME: убрать это отсюда
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening
