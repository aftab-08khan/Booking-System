import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { 
  FiCalendar, 
  FiClock, 
  FiDollarSign, 
  FiUsers, 
  FiMapPin, 
  FiCreditCard,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { MdEvent, MdLocalActivity } from "react-icons/md";

function BookEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await API.get(`events/${id}/`);
      setEvent(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching event:", error);
      setError("Failed to load event details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!event) return;
    
    setBookingInProgress(true);
    setError(null);
    
    try {
      // Check if user is logged in
      const token = localStorage.getItem("access");
      if (!token) {
        setError("Please login to book this event");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      
      // Create booking
      const bookingResponse = await API.post("bookings/", {
        event: event.id
      });
      
      console.log("Booking created:", bookingResponse.data);
      
      // Create payment session
      const paymentResponse = await API.post("payments/create-checkout-session/", {
        booking_id: bookingResponse.data.id
      });
      
      console.log("Payment session created:", paymentResponse.data);
      
      // Redirect to Stripe checkout
      if (paymentResponse.data.checkout_url) {
        window.location.href = paymentResponse.data.checkout_url;
      } else {
        throw new Error("No checkout URL received");
      }
      
    } catch (error) {
      console.error("Booking error:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          setError("Please login to book this event");
          setTimeout(() => navigate("/login"), 2000);
        } else if (error.response.data?.error) {
          setError(error.response.data.error);
        } else if (error.response.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("Failed to create booking. Please try again.");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError(error.message || "An unexpected error occurred");
      }
    } finally {
      setBookingInProgress(false);
    }
  };

  const getSeatStatus = () => {
    if (!event) return { color: "text-gray-500", text: "Loading..." };
    if (event.available_seats === 0) return { color: "text-red-600", text: "Sold Out" };
    if (event.available_seats <= 10) return { color: "text-orange-600", text: "Only ${event.available_seats} seats left!" };
    return { color: "text-green-600", text: `${event.available_seats} seats available` };
  };

  const seatStatus = getSeatStatus();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const occupancyPercentage = event?.capacity ? ((event.capacity - event.available_seats) / event.capacity) * 100 : 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        {/* Event Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-600 to-indigo-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MdLocalActivity className="w-32 h-32 text-white opacity-20" />
                </div>
                {event.available_seats === 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    SOLD OUT
                  </div>
                )}
              </div>
              
              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {event.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="bg-blue-100 rounded-full p-2">
                      <FiCalendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="font-semibold">
                        {new Date(event.start_datetime).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="bg-blue-100 rounded-full p-2">
                      <FiClock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p className="font-semibold">
                        {new Date(event.start_datetime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - {new Date(event.end_datetime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="bg-blue-100 rounded-full p-2">
                        <FiMapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="font-semibold">{event.location}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="bg-blue-100 rounded-full p-2">
                      <FiUsers className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Capacity</p>
                      <p className="font-semibold">{event.capacity} people</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Event</span>
                  <span className="font-semibold text-gray-900">{event.title}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Price</span>
                  <div className="flex items-baseline gap-1">
                    <FiDollarSign className="w-4 h-4 text-gray-600" />
                    <span className="text-2xl font-bold text-gray-900">{event.price}</span>
                    <span className="text-gray-500">/person</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Availability</span>
                  <span className={`font-semibold ${seatStatus.color}`}>
                    {seatStatus.text}
                  </span>
                </div>
              </div>

              {/* Seat Progress */}
              {event.capacity > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Booking Progress</span>
                    <span>{Math.round(occupancyPercentage)}% Booked</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        occupancyPercentage >= 80 ? 'bg-orange-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      }`}
                      style={{ width: `${occupancyPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={bookingInProgress || event.available_seats === 0}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2
                  ${(bookingInProgress || event.available_seats === 0)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl"
                  }`}
              >
                {bookingInProgress ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : event.available_seats === 0 ? (
                  <>
                    <FiAlertCircle className="w-5 h-5" />
                    Sold Out
                  </>
                ) : (
                  <>
                    <FiCreditCard className="w-5 h-5" />
                    Book Now & Pay
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Information</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-green-600" />
              <span>Booking confirmation will be sent after successful payment</span>
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-green-600" />
              <span>Cancel up to 24 hours before the event for a full refund</span>
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-green-600" />
              <span>Please arrive 15 minutes before the start time</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BookEventPage;