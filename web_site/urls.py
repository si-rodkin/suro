from django.urls import path

from .views import LoginView, StatisticView, DeviceView, EditDeviceView, GuardedObjectsView, GuardedObjectsDetailView, \
    GuardRouteView, GuardRouteDetailView, MarkersView, MarkerDetailsView, user_list, user_details

app_name = 'web_site'

urlpatterns = [
    path('', StatisticView.as_view()),
    path('statistic/', StatisticView.as_view(), name="statistic"),

    path('accounts/login/', LoginView.as_view(), name="login_page"),

    path('devices/', DeviceView.as_view(), name="devices_list"),
    path('devices/<int:id>', EditDeviceView.as_view(), name="device_detail"),

    path('markers/', MarkersView.as_view(), name="markers_list"),
    path('markers/<int:id>', MarkerDetailsView.as_view(), name="marker_detail"),

    path('guarded-objects/', GuardedObjectsView.as_view(), name="guarded_objects_list"),
    path('guarded-objects/<int:id>', GuardedObjectsDetailView.as_view(), name="guarded_object_detail"),
    path('guarded-objects/<int:object_id>/guard-routes/', GuardRouteView.as_view(), name="routes_list"),
    path('guarded-objects/<int:object_id>/guard-routes/<int:route_id>', GuardRouteDetailView.as_view(),
         name="route_detail"),

    path('users/', user_list, name='users_list'),
    path('users/<int:id>', user_details, name='user_details'),
]
