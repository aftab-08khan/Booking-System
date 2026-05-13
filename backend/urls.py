from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/events/", include("events.urls")),
        path('api/events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),

    path("api/bookings/", include("bookings.urls")),
    path("api/payments/", include("payments.urls")),
]