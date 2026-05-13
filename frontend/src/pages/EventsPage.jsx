import { useEffect, useState } from "react";
import API from "../api/axios";

function EventsPage() {
  const [events, setEvents] = useState([]);
console.log(events,'events');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await API.get("events/");

      setEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async (eventId) => {
    try {
      const bookingResponse = await API.post("bookings/", {
        event: eventId,
      });

      const paymentResponse = await API.post(
        "payments/create-checkout-session/",
        {
          booking_id: bookingResponse.data.id,
        }
      );

      window.location.href = paymentResponse.data.checkout_url;
    } catch (error) {
      console.log(error);

      alert("Booking failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold mb-12">Upcoming Events</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events?.map((event) => (
          <div
            key={event?.id}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl hover:translate-y-[-5px] transition"
          >
            <div className="h-48 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 mb-6"></div>

            <h2 className="text-2xl font-bold mb-3">{event?.title}</h2>

            <p className="text-gray-300 mb-4">{event?.description}</p>

            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold">${event?.price}</span>

              <span className="text-sm text-gray-400">
                {event?.available_seats} seats left
              </span>
            </div>

            <button
              onClick={() => handleBooking(event?.id)}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
