from django.contrib import admin
from django.urls import path, re_path, include

import api.urls

from .views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls', namespace='api')),
    re_path(r'^(?:.*)/?$', index),
    # path(r'devices/', index),
    # re_path(r'^object\/((\w|\d)+\/)*$', index),
]
