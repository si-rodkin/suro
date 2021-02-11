from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.renderers import JSONRenderer

from data_access.models import Device, Marker, GuardedObject, GuardRoute, Round, Commit
from . import services
from .serializers import DeviceSerializer, MarkerSerializer, TheRingSerializer, GuardRouteSerializer, RoundSerializer, CommitSerializer, CsrfExemptSessionAuthentication

from rest_framework.authentication import SessionAuthentication, BasicAuthentication 

def get_current_route(request, imei) -> HttpResponse:
    return HttpResponse(services.get_current_route(imei))


def get_current_datetime(request) -> HttpResponse:
    return HttpResponse(services.get_current_datetime())


def read_commit(requst, imei: str, rfid: str, roundId: str) -> HttpResponse:
    return HttpResponse(services.read_commit(imei, rfid, roundId, requst.body[1], requst.body[2]))


def read_object_routes(request, objectId):
    routes = GuardRoute.objects.filter(guard_object__id=objectId)
    serializer = GuardRouteSerializer(data=routes, many=True)
    serializer.is_valid()
    return HttpResponse(JSONRenderer().render(serializer.data))


def read_marker_rounds(request, markerId):
    rounds = Round.objects.filter(marker__id=markerId)
    serializer = RoundSerializer(data=rounds, many=True)
    serializer.is_valid()
    return HttpResponse(JSONRenderer().render(serializer.data))


def read_free_markers(request, routeId):
    markers = Marker.objects.filter(route=None) | Marker.objects.filter(route__id=routeId)
    serializer = MarkerSerializer(data=markers, many=True)
    serializer.is_valid()
    return HttpResponse(JSONRenderer().render(serializer.data))


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
