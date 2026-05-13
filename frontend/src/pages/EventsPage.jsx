import { useEffect, useState } from "react";
import API from "../api/axios";
import { FiCalendar, FiSearch, FiUsers, FiDollarSign, FiClock, FiMapPin } from "react-icons/fi";
import { MdEvent, MdLocalActivity } from "react-icons/md";

function EventCard({ event, onBooking }) {
  const isSoldOut = event.available_seats === 0;
  const availableSeats = event.available_seats;
  const totalSeats = event.capacity;
  const occupancyPercentage = totalSeats ? ((totalSeats - availableSeats) / totalSeats) * 100 : 0;

  const handleBookClick = (e) => {
    e.preventDefault(); 
    if (!isSoldOut && event.id) {
      onBooking(event.id); 
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
      
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <MdLocalActivity className="w-16 h-16 text-white opacity-20 group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        {isSoldOut && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
            SOLD OUT
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <span className="text-white text-sm font-medium flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            {new Date(event.start_datetime).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <span className="text-white text-sm font-medium flex items-center gap-1">
            <FiClock className="w-3 h-3" />
            {new Date(event.start_datetime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h2>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiMapPin className="w-4 h-4 text-blue-600" />
              <span>{event.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiUsers className="w-4 h-4 text-blue-600" />
            <span className={isSoldOut ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
              {isSoldOut ? "Sold Out" : `${availableSeats} seat${availableSeats !== 1 ? 's' : ''} available`}
            </span>
          </div>
        </div>

        {!isSoldOut && totalSeats && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Booking progress</span>
              <span>{Math.round(occupancyPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-baseline gap-1">
            <FiDollarSign className="w-5 h-5 text-gray-600" />
            <span className="text-2xl font-bold text-gray-900">{event.price}</span>
            <span className="text-sm text-gray-500">/person</span>
          </div>
          
          <button
            onClick={handleBookClick}
            disabled={isSoldOut}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95
              ${isSoldOut
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg"
              }`}
          >
            {isSoldOut ? "Sold Out" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await API.get("events/");
      setEvents(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.log("Fetch events error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (eventId) => {
    console.log(eventId,'id');
    
    if (!eventId) {
      console.error("No event ID provided");
      alert("Invalid event");
      return;
    }

    setBookingInProgress(true);
    
    try {
      console.log("Booking event with ID:", eventId);
      
      const bookingResponse = await API.post("bookings/", {
        event: eventId  
      });

      console.log("Booking response:", bookingResponse.data);

      const paymentResponse = await API.post("payments/create-checkout-session/", {
        booking_id: bookingResponse.data.id
      });

      console.log("Payment response:", paymentResponse.data);

      if (paymentResponse.data.checkout_url) {
        window.location.href = paymentResponse.data.checkout_url;
      } else {
        throw new Error("No checkout URL received");
      }

    } catch (error) {
      console.error("Booking error details:", error);
      
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(`Booking failed: ${error.response.data.message || "Please try again"}`);
      } else if (error.request) {
        alert("Network error. Please check your connection.");
      } else {
        alert(`Booking failed: ${error.message}`);
      }
    } finally {
      setBookingInProgress(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "available" && event.available_seats > 0) ||
                         (filter === "soldout" && event.available_seats === 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h1>
          <p className="text-gray-600 text-lg">
            Discover and book amazing experiences
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "all"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilter("available")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "available"
                    ? "bg-gradient-to-r from-green-600 to-teal-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setFilter("soldout")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "soldout"
                    ? "bg-gradient-to-r from-red-600 to-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Sold Out
              </button>
            </div>
          </div>
        </div>

        {bookingInProgress && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-700">Processing your booking...</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">Loading amazing events...</p>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <MdEvent className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-500">
              {searchTerm ? "Try adjusting your search criteria" : "Check back later for new events"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onBooking={handleBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsPage;