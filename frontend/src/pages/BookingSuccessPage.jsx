import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { FiCheckCircle, FiCalendar, FiDollarSign, FiTrendingUp, FiBookmark } from "react-icons/fi";
import { MdEvent, MdVerified } from "react-icons/md";

function BookingSuccessPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestBooking();
  }, []);

  const fetchLatestBooking = async () => {
    try {
      const response = await API.get("bookings/");
      
      setBookings(response?.data);
    } catch (err) {
      console.log(err,'eerrr');
    } finally {
      setLoading(false);
    }
  };

  const latest = bookings[0];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center">
          
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
            <FiCheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Your booking is confirmed. You're all set!
          </p>

          {!loading && latest && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <MdVerified className="w-5 h-5 text-green-600" />
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                  Booking Details
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MdEvent className="w-4 h-4" />
                    <span className="text-sm">Event</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">
                    {latest.event_title}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiDollarSign className="w-4 h-4" />
                    <span className="text-sm">Amount</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">
                    ${latest.amount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiTrendingUp className="w-4 h-4" />
                    <span className="text-sm">Status</span>
                  </div>
                  <span className="text-green-600 font-semibold text-sm capitalize">
                    {latest.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2 text-gray-600">Loading booking details...</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FiBookmark className="w-5 h-5" />
              View My Bookings
            </Link>
            
            <Link
              to="/"
              className="w-full border-2 border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MdEvent className="w-5 h-5" />
              Browse More Events
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BookingSuccessPage;