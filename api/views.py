from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from data_access.models import Device, Marker, GuardedObject, GuardRoute
from . import services
from .serializers import DeviceSerializer, MarkerSerializer, TheRingSerializer, GuardRouteSerializer


def get_current_route(request, imei) -> HttpResponse:
    return HttpResponse(services.get_current_route(imei))


def get_current_datetime(request) -> HttpResponse:
    return HttpResponse(services.get_current_datetime())


def read_commit(requst, imei: str, rfid: str) -> HttpResponse:
    return HttpResponse(services.read_commit(imei, rfid, requst.body[1], requst.body[2]))


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
