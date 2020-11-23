from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.utils.decorators import method_decorator
from django.views import View

from data_access.models import Device, GuardedObject, GuardRoute, Marker, User


class LoginView(View):
    """Представление отвечающая за авторизацию"""

    def get(self, request):
        if request.user.is_authenticated:
            logout(request)
        redirect_url = '/'
        if request.GET.get('next') is not None:
            redirect_url = request.GET['next']
        return render(request, 'web_site/login_form.html', context={'next': redirect_url})

    def post(self, request):
        user = authenticate(request, username=request.POST['username'], password=request.POST['password'])
        if user is not None:
            login(request, user)
            return redirect(request.POST['next'])
        else:
            return HttpResponse('Invalid username or password')

# TODO: классы, содержащие единственный метод заменить на функции

class StatisticView(View):
    @method_decorator(login_required)
    def get(self, request):
        return render(request, 'web_site/statistics/list.html', context={'user': request.user})


class DeviceView(View):
    @method_decorator(login_required)
    def get(self, request):
        devices = Device.objects.all()
        return render(request, 'web_site/devices/list.html', context={'devices': devices})


class EditDeviceView(View):
    @method_decorator(login_required)
    def get(self, request, id):
        device = Device()
        if id > 0:
            device = Device.objects.get(pk=id)
        return render(request, 'web_site/devices/edit.html', context={'device': device})


class GuardedObjectsView(View):
    @method_decorator(login_required)
    def get(self, request):
        guarded_objects = GuardedObject.objects.all()
        return render(request, 'web_site/guarded_objects/list.html', context={'guarded_objects': guarded_objects})


class GuardedObjectsDetailView(View):
    @method_decorator(login_required)
    def get(self, request, id):
        guarded_object = GuardedObject()
        if id > 0:
            guarded_object = GuardedObject.objects.get(pk=id)
        return render(request, 'web_site/guarded_objects/edit.html', context={'guarded_object': guarded_object})


class GuardRouteView(View):
    @method_decorator(login_required)
    def get(self, request, object_id):
        guarded_object = GuardedObject.objects.get(pk=object_id)
        routes = GuardRoute.objects.filter(guard_object=guarded_object)
        return render(request, 'web_site/guard_routes/list.html',
                      context={'object_id': object_id, 'routes': routes})


class GuardRouteDetailView(View):
    @method_decorator(login_required)
    def get(self, request, object_id, route_id):
        route = GuardRoute()
        devices = Device.objects.all()
        markers = Marker.objects.filter(route=None)
        if route_id > 0:
            route = GuardRoute.objects.get(pk=route_id)
            markers = markers | Marker.objects.filter(route=route)
        return render(request, 'web_site/guard_routes/edit.html',
                      context={'object_id': object_id, 'route': route, 'devices': devices, 'markers': markers})


class MarkersView(View):
    @method_decorator(login_required)
    def get(self, request):
        markers = Marker.objects.all()
        return render(request, 'web_site/markers/list.html', context={'markers': markers})


class MarkerDetailsView(View):
    @method_decorator(login_required)
    def get(self, request, id):
        marker = Marker.objects.get(pk=id)
        devices = marker.route.devices.all()
        return render(request, 'web_site/markers/edit.html', context={'marker': marker, 'devices': devices})

# TODO: разрешить доступ только для Admins- и Inspector-ролей
# TODO: сохранять идентификатор пользователя в сессии при авторизации
@login_required
def user_list(request):
    """
    Выбирет пользователей в системе и рендерит страницу с ними
    """
    users = User.objects.all()
    return render(request, 'web_site/users/list.html', context={'users': users})

def user_details(request, id):
    pass
