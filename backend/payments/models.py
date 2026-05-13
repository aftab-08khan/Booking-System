from django.db import models
from bookings.models import Booking


class Payment(models.Model):

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    )

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE
    )

    stripe_checkout_session_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    stripe_payment_intent_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    currency = models.CharField(max_length=10, default="usd")

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    raw_event_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    def __str__(self):
        return f"Payment {self.id}"