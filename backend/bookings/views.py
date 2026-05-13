from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError

from .models import Booking
from .serializers import BookingSerializer
from events.models import Event


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):

        event = serializer.validated_data.get("event")

        if not event:
            raise ValidationError({"event": "Event is required"})

        # -------------------------
        # OVERBOOKING CHECK
        # -------------------------
        booked = event.bookings.filter(status="confirmed").count()

        if booked >= event.capacity:
            raise ValidationError("No seats available")

        serializer.save(
            user=self.request.user,
            status="pending"
        )

from rest_framework.generics import ListAPIView
from .models import Booking
from .serializers import BookingSerializer

class UserBookingListView(ListAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)