from django.urls import path
from .views import BookingCreateView, UserBookingListView

urlpatterns = [
    path("", BookingCreateView.as_view()),
    path("my/", UserBookingListView.as_view()),
]