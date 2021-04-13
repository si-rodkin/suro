from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.renderers import JSONRenderer

from data_access.models import Device, Marker, GuardedObject, GuardRoute, Round, Commit, User

from . import services
# FIXME
from . import _services

from .serializers import DeviceSerializer, MarkerSerializer, TheRingSerializer, GuardRouteSerializer, RoundSerializer, CommitSerializer, UserSerializer, CsrfExemptSessionAuthentication

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.authtoken.models import Token

create_marker_mode = False

def switch_create_marker_mode(request):
    global create_marker_mode
    create_marker_mode = True if create_marker_mode is False else False
    return HttpResponse(str(create_marker_mode))

def get_current_route(request, imei) -> HttpResponse:
    return HttpResponse(services.get_current_route(imei))


def get_current_datetime(request) -> HttpResponse:
    return HttpResponse(_services.get_current_datetime())


def read_commit(requst, imei: str, rfid: str, roundId: str) -> HttpResponse:
    global create_marker_mode
    if create_marker_mode is True:
        marker = Marker.objects.create(name="", rfid=rfid, route=None)
        serializer = MarkerSerializer(marker)
        return HttpResponse(JSONRenderer().render(serializer.data))
    return HttpResponse(_services.read_commit(imei, rfid, roundId, requst.body[0], requst.body))


def read_object_routes(request, objectId):
    routes = GuardRoute.objects.filter(guard_object__id=objectId)
    serializer = GuardRouteSerializer(data=routes, many=True)
    serializer.is_valid()
    return HttpResponse(JSONRenderer().render(serializer.data))


def read_marker_rounds(request, markerId):
    markerId = markerId if markerId != 0 else None
    rounds = Round.objects.filter(marker__id=markerId)
    serializer = RoundSerializer(data=rounds, many=True)
    serializer.is_valid()
    return HttpResponse(JSONRenderer().render(serializer.data))


def read_free_markers(request, routeId):
    markers = Marker.objects.filter(
        route=None) | Marker.objects.filter(route__id=routeId)
    serializer = MarkerSerializer(data=markers, many=True)
    serializer.is_valid()
    return HttpResponse(JSONRenderer().render(serializer.data))


def user_data(request: HttpResponse):
    user = Token.objects.get(key=request.headers['authorization']).user
    serialiser = UserSerializer(user)
    return HttpResponse(JSONRenderer().render(serialiser.data))


class DeviceView(ListCreateAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer


class DeviceDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(DeviceDetailView, self).dispatch(request, *args, **kwargs)


class MarkerView(ListCreateAPIView):
    queryset = Marker.objects.all()
    serializer_class = MarkerSerializer


class MarkerDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Marker.objects.all()
    serializer_class = MarkerSerializer


class TheRingView(ListCreateAPIView):
    queryset = GuardedObject.objects.all()
    serializer_class = TheRingSerializer


class TheRingDetailView(RetrieveUpdateDestroyAPIView):
    queryset = GuardedObject.objects.all()
    serializer_class = TheRingSerializer


class GuardRouteView(ListCreateAPIView):
    queryset = GuardRoute.objects.all()
    serializer_class = GuardRouteSerializer


class GuardRouteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = GuardRoute.objects.all()
    serializer_class = GuardRouteSerializer


class RoundView(ListCreateAPIView):
    queryset = Round.objects.all()
    serializer_class = RoundSerializer


class RoundDetail(RetrieveUpdateDestroyAPIView):
    queryset = Round.objects.all()
    serializer_class = RoundSerializer


class CommitView(ListAPIView):
    queryset = Commit.objects.all()
    serializer_class = CommitSerializer


class UserView(ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
