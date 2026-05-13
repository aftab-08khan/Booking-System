import { Link } from "react-router-dom";
import { FiCalendar, FiUsers, FiDollarSign, FiClock, FiMapPin } from "react-icons/fi";
import { MdLocalActivity } from "react-icons/md";

export function EventCard({ event ,handleBookClick}) {
  const isSoldOut = event.available_seats === 0;
  const availableSeats = event.available_seats;
  const totalSeats = event.capacity;
  const occupancyPercentage = totalSeats ? ((totalSeats - availableSeats) / totalSeats) * 100 : 0;

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