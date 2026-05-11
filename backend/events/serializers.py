from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    available_seats = serializers.ReadOnlyField()

    class Meta:
        model = Event
        fields = '__all__'