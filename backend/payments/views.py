from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from django.utils import timezone
from bookings.models import Booking
from .models import Payment
import stripe
import json

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            booking_id = request.data.get('booking_id')
            
            if not booking_id:
                return Response(
                    {"error": "booking_id is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the booking
            try:
                booking = Booking.objects.get(id=booking_id, user=request.user)
            except Booking.DoesNotExist:
                return Response(
                    {"error": "Booking not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Check if payment already exists for this booking
            existing_payment = Payment.objects.filter(booking=booking).first()
            
            if existing_payment and existing_payment.stripe_checkout_session_id:
                # If payment exists with a session, try to retrieve it
                try:
                    session = stripe.checkout.Session.retrieve(existing_payment.stripe_checkout_session_id)
                    if session.url and session.status == 'open':
                        return Response({
                            'checkout_url': session.url,
                            'session_id': existing_payment.stripe_checkout_session_id
                        })
                except:
                    # Session expired or invalid, delete and create new
                    existing_payment.delete()
            elif existing_payment:
                # Delete invalid payment record
                existing_payment.delete()
            
            # Get event details
            event = booking.event
            
            # Create Stripe checkout session
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'unit_amount': int(float(event.price) * 100),
                            'product_data': {
                                'name': event.title,
                                'description': event.description[:200] if event.description else "Event booking",
                            },
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url='http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:5173/dashboard',
                metadata={
                    'booking_id': booking.id,
                    'event_id': event.id,
                    'user_id': request.user.id,
                },
            )
            
            # Create payment record
            payment = Payment.objects.create(
                booking=booking,
                amount=event.price,
                stripe_checkout_session_id=session.id,
                status="pending",
                currency="usd"
            )
            
            return Response({
                'checkout_url': session.url,
                'session_id': session.id,
                'payment_id': payment.id
            })
            
        except stripe.error.StripeError as e:
            print(f"Stripe error: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Error creating checkout session: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class StripeWebhookView(APIView):
    """
    Handle Stripe webhook events
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
        
        if not endpoint_secret:
            print("Webhook secret not configured")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            print(f"Invalid payload: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            print(f"Invalid signature: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        print(f"Received webhook event: {event['type']}")
        
        # Handle the event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            booking_id = session.get('metadata', {}).get('booking_id')
            
            if booking_id:
                try:
                    booking = Booking.objects.get(id=booking_id)
                    booking.status = 'confirmed'
                    booking.confirmed_at = timezone.now()
                    booking.save()
                    
                    # Update payment record if exists
                    payment = Payment.objects.filter(booking=booking).first()
                    if payment:
                        payment.status = 'completed'
                        payment.stripe_payment_intent_id = session.get('payment_intent')
                        payment.save()
                    
                    # Update available seats
                    event_obj = booking.event
                    if event_obj.available_seats > 0:
                        event_obj.available_seats -= 1
                        event_obj.save()
                    
                    print(f"Booking {booking_id} confirmed successfully")
                except Booking.DoesNotExist:
                    print(f"Booking {booking_id} not found")
            else:
                print("No booking_id in metadata")
        
        elif event['type'] == 'checkout.session.expired':
            session = event['data']['object']
            booking_id = session.get('metadata', {}).get('booking_id')
            
            if booking_id:
                try:
                    booking = Booking.objects.get(id=booking_id)
                    if booking.status == 'pending':
                        booking.status = 'failed'
                        booking.save()
                    
                    payment = Payment.objects.filter(booking=booking).first()
                    if payment:
                        payment.status = 'failed'
                        payment.save()
                    
                    print(f"Booking {booking_id} expired")
                except Booking.DoesNotExist:
                    print(f"Booking {booking_id} not found")
        
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            print(f"Payment failed: {payment_intent.get('id')}")
        
        return Response(status=status.HTTP_200_OK)