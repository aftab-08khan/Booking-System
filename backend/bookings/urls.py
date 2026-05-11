from django.urls import path
from .views import BookingCreateView, UserBookingListView

urlpatterns = [
    path('', UserBookingListView.as_view()),
    path('create/', BookingCreateView.as_view()),
]