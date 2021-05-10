from django.http import HttpRequest, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import PBKDF2SHA1PasswordHasher
from rest_framework.authtoken.models import Token
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.renderers import JSONRenderer

from data_access.models import Device, Marker, GuardedObject, GuardRoute, Round, Commit, User
from . import services
from .serializers import DeviceSerializer, MarkerSerializer, TheRingSerializer, GuardRouteSerializer, RoundSerializer, \
    CommitSerializer, UserSerializer

create_marker_mode = False


def switch_create_marker_mode(request):
    global create_marker_mode
    create_marker_mode = create_marker_mode is False
    return HttpResponse(str(create_marker_mode))


def get_current_route(request: HttpRequest, imei) -> HttpResponse:
    return HttpResponse(services.get_current_route(imei, request.GET.get('limit')))


def get_current_datetime(request) -> HttpResponse:
    return HttpResponse(services.get_current_datetime())


def read_commit(requst, imei: str, rfid: str, roundId: str) -> HttpResponse:
    global create_marker_mode
    if create_marker_mode is True:
        marker = Marker.objects.create(name="", rfid=rfid, route=None)
        serializer = MarkerSerializer(marker)
        return HttpResponse(JSONRenderer().render(serializer.data))
    return HttpResponse(services.read_commit(imei, rfid, roundId, requst.body))


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

# FIXME: отрефакторить вьюхи получения коммитов
def get_all_commits(request):
    commits = services.get_all_commits()
    serializer = CommitSerializer(data=commits, many=True)
    serializer.is_valid()
    return HttpResponse(JSONRenderer().render(serializer.data))


def get_planned_commits(request):
    commits = services.get_planned_commits()
    serializer = CommitSerializer(data=commits, many=True)
    serializer.is_valid()
    return HttpResponse(JSONRenderer().render(serializer.data))


def get_unplanned_commits(request):
    commits = services.get_unplanned_commits()
    serializer = CommitSerializer(data=commits, many=True)
    serializer.is_valid()
    return HttpResponse(JSONRenderer().render(serializer.data))


def get_missed_commits(request):
    commits = services.get_missed_commits()
    serializer = CommitSerializer(data=commits, many=True)
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


class UserView(ListCreateAPIView, RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer

    def get(self, request):
        user = User.objects.get(id=request.GET['uid'])
        employees = User.objects.filter(lead_id=user.id)
        serialiser = UserSerializer(data=employees, many=True)
        serialiser.is_valid()
        return HttpResponse(JSONRenderer().render(serialiser.data))

    def post(self, request: HttpRequest):
        request.data['password'] = PBKDF2SHA1PasswordHasher().encode('123456', 'salt', 180000)
        return self.create(request)


class UserDetailView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
