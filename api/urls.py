from django.urls import path

from api.views import get_current_route, get_current_datetime, read_commit, DeviceView, MarkerView, TheRingView, \
    GuardRouteView, DeviceDetailView, MarkerDetailView, TheRingDetailView, GuardRouteDetailView, RoundView, RoundDetail

app_name = 'api'

urlpatterns = [
    path('sync/date', get_current_datetime),
    path('sync/route/<str:imei>', get_current_route),

    path('commit/<str:imei>/<str:rfid>', read_commit),

    path('devices/', DeviceView.as_view(), name='devices'),
    path('devices/<int:pk>', DeviceDetailView.as_view(), name='device'),

    path('markers/', MarkerView.as_view(), name='markers'),
    path('markers/<int:pk>', MarkerDetailView.as_view(), name='marker'),

    path('guarded-objects/', TheRingView.as_view(), name='guarded_objects'),
    path('guarded-objects/<int:pk>', TheRingDetailView.as_view(), name='guarded_object'),

    path('guard-routes/', GuardRouteView.as_view(), name='routes'),
    path('guard-routes/<int:pk>', GuardRouteDetailView.as_view(), name='route'),

    path('rounds/', RoundView.as_view(), name='round_view'),
    path('rounds/<int:pk>', RoundDetail.as_view(), name='round_detail')
]
