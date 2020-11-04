from django.contrib import admin
from django.urls import path, include

import api.urls
import web_site.urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls', namespace='api')),
    path('', include('web_site.urls', namespace='web_site')),
]
