from django.urls import path, include

from api.views import DeviceView, MarkerView, TheRingView, \
    GuardRouteView, DeviceDetailView, MarkerDetailView, TheRingDetailView, GuardRouteDetailView, RoundView, RoundDetail, CommitView

from api.views import get_current_route, get_current_datetime, read_commit, \
    read_object_routes, read_marker_rounds, read_free_markers

app_name = 'api'

urlpatterns = [
    path('rest-auth/', include('rest_auth.urls')),

    path('sync/date/', get_current_datetime),
    path('sync/route/<str:imei>/', get_current_route),

    path('commits/', CommitView.as_view()),
    path('commit/<str:imei>/<str:rfid>/<str:roundId>/', read_commit),

    path('devices/', DeviceView.as_view(), name='devices'),
    path('devices/<int:pk>/', DeviceDetailView.as_view(), name='device'),

    path('markers/', MarkerView.as_view(), name='markers'),
    path('markers/<int:pk>/', MarkerDetailView.as_view(), name='marker'),
    path('markers/free-or/<routeId>', read_free_markers),
    path('markers/<int:markerId>/rounds/', read_marker_rounds),

    path('guarded-objects/', TheRingView.as_view(), name='guarded_objects'),
    path('guarded-objects/<int:pk>/', TheRingDetailView.as_view(), name='guarded_object'),
    path('guarded-objects/<int:objectId>/guard-routes/', read_object_routes),

    path('guard-routes/', GuardRouteView.as_view(), name='routes'),
    path('guard-routes/<int:pk>/', GuardRouteDetailView.as_view(), name='route'),

    path('rounds/', RoundView.as_view(), name='round_view'),
    path('rounds/<int:pk>/', RoundDetail.as_view(), name='round_detail')
]
