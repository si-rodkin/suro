from django.contrib import admin

from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Device)
admin.site.register(GuardedObject)
admin.site.register(GuardRoute)
admin.site.register(Marker)
admin.site.register(Round)
admin.site.register(Commit)
