from django.urls import path
from .views import EventListView, EventDetailView, EventListCreateView

urlpatterns = [
    path("", EventListView.as_view(), name="event-list"),
    path("create/", EventListCreateView.as_view(), name="event-create"),
    path("<int:pk>/", EventDetailView.as_view(), name="event-detail"),
]