from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()

    price = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.IntegerField()

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def available_seats(self):
        booked = self.bookings.filter(status="confirmed").count()
        return self.capacity - booked