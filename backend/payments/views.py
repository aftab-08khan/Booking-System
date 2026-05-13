import stripe

from django.conf import settings
from django.http import HttpResponse
from django.utils.timezone import now

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from bookings.models import Booking
from .models import Payment


stripe.api_key = settings.STRIPE_SECRET_KEY


# =========================================
# 1. CREATE STRIPE CHECKOUT SESSION
# =========================================
class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        booking_id = request.data.get("booking_id")

        if not booking_id:
            return Response({"error": "booking_id required"}, status=400)

        try:
            booking = Booking.objects.get(
                id=booking_id,
                user=request.user
            )
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": booking.event.title,
                        },
                        "unit_amount": int(booking.event.price * 100),
                    },
                    "quantity": 1,
                }],
                mode="payment",
                success_url="http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
                cancel_url="http://localhost:5173/cancel",
                metadata={"booking_id": booking.id}
            )
        except Exception as e:
            return Response({"error": str(e)}, status=500)

        payment, created = Payment.objects.get_or_create(
            booking=booking,
            defaults={
                "amount": booking.event.price,
                "stripe_checkout_session_id": session.id,
                "status": "pending"
            }
        )

        return Response({
            "checkout_url": session.url
        })


# =========================================
# 2. STRIPE WEBHOOK
# =========================================
class StripeWebhookView(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request):

        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

        try:
            event = stripe.Webhook.construct_event(
                payload,
                sig_header,
                settings.STRIPE_WEBHOOK_SECRET
            )
        except Exception:
            return HttpResponse(status=400)

        if event["type"] == "checkout.session.completed":

            session = event["data"]["object"]
            booking_id = session["metadata"]["booking_id"]

            try:
                booking = Booking.objects.get(id=booking_id)
            except Booking.DoesNotExist:
                return HttpResponse(status=404)

            try:
                payment = Payment.objects.get(booking=booking)
            except Payment.DoesNotExist:
                return HttpResponse(status=404)

            if payment.status == "completed":
                return HttpResponse(status=200)

            payment.status = "completed"
            payment.stripe_payment_intent_id = session.get("payment_intent")
            payment.raw_event_id = event["id"]
            payment.save()

            booking.status = "confirmed"
            booking.confirmed_at = now()
            booking.save()

        return HttpResponse(status=200)