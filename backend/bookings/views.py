from rest_framework import generics, permissions, serializers

from .models import Booking
from .serializers import BookingSerializer
from events.models import Event


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        event = serializer.validated_data['event']

        # Count confirmed bookings
        booked_count = Booking.objects.filter(
            event=event,
            status="confirmed"
        ).count()

        # Capacity check (safe version)
        if booked_count >= event.capacity:
            raise serializers.ValidationError("No seats available")

        serializer.save(
            user=self.request.user,
            status="pending"
        )


class UserBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)