from django.urls import path
from .views import BookingCreateView, UserBookingListView

urlpatterns = [
    path("", BookingCreateView.as_view(), name="booking-create"),
    path("my-bookings/", UserBookingListView.as_view(), name="my-bookings"),
]