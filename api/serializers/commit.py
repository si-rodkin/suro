from rest_framework.serializers import ModelSerializer

from data_access.models import Commit
from .round import RoundSerializer
from .marker import MarkerSerializer
from .device import DeviceSerializer


class CommitSerializer(ModelSerializer):
    round = RoundSerializer(read_only=True)
    device = DeviceSerializer(read_only=True)
    marker = MarkerSerializer(read_only=True)

    class Meta:
        model = Commit
        fields = '__all__'
