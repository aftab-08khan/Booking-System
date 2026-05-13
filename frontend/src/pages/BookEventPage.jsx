import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function BookEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/events/${id}/`)
      .then((res) => res.json())
      .then((data) => setEvent(data));
  }, [id]);

  const handleBook = async () => {
    try {
      const bookingRes = await fetch("http://localhost:8000/api/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({
          event_id: id,
        }),
      });

      const booking = await bookingRes.json();

      const stripeRes = await fetch(
        "http://localhost:8000/api/payments/create-checkout-session/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({
            booking_id: booking.id,
          }),
        }
      );

      const data = await stripeRes.json();

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  if (!event) {
    return <div className="text-white p-10">Loading event...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-2xl bg-white/10 border border-white/10 backdrop-blur-lg rounded-3xl p-8">
        <h1 className="text-4xl font-bold">{event?.title}</h1>

        <p className="text-slate-400 mt-3">{event?.description}</p>

        <div className="mt-6 space-y-2 text-slate-300">
          <p>📅 Date: {event?.date}</p>
          <p>💰 Price: ${event?.price}</p>
          <p>👥 Capacity: {event?.capacity}</p>
        </div>

        <button
          onClick={handleBook}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-medium"
        >
          Book & Pay
        </button>
      </div>
    </div>
  );
}

export default BookEventPage;
