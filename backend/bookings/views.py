from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status

from .models import Booking
from .serializers import BookingSerializer
from events.models import Event


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        event = serializer.validated_data['event']

        # ❌ Prevent overbooking
        if event.available_seats <= 0:
            raise serializers.ValidationError("No seats available")

        serializer.save(user=self.request.user, status="pending")


class UserBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)