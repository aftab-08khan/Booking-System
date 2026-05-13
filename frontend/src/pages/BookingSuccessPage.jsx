import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function BookingSuccessPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    fetchLatestBooking();
  }, []);

  const fetchLatestBooking = async () => {
    try {
      const response = await API.get("bookings/");
      setBookings(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const latest = bookings[0];

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <div className="w-full max-w-md text-center">

        {/* Icon */}
        <div className="w-24 h-24 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>

        <h1 className="text-4xl font-bold mb-3">Payment Successful!</h1>
        <p className="text-gray-400 mb-8">
          Your booking is confirmed. You're all set!
        </p>

        {/* Latest booking info */}
        {!loading && latest && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
              Booking Details
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Event</span>
              <span className="font-semibold text-sm">{latest.event_title}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Amount</span>
              <span className="font-semibold text-sm">${latest.amount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Status</span>
              <span className="text-green-400 font-semibold text-sm capitalize">
                {latest.status}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:scale-[1.02] transition block"
          >
            View My Bookings
          </Link>
          <Link
            to="/"
            className="w-full border border-white/20 text-white font-medium py-4 rounded-xl hover:bg-white/10 transition block"
          >
            Browse More Events
          </Link>
        </div>

      </div>
    </div>
  );
}

export default BookingSuccessPage;