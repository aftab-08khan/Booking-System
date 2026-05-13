import { Link } from "react-router-dom";

export function EventCard({ event }) {
  console.log(event,'eeeeee');
  
    const isSoldOut = event.available_seats === 0;
  
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:translate-y-[-4px] hover:border-white/20 transition-all duration-300">
  
        <div className="h-44 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">🎟️</span>
          </div>
          {isSoldOut && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              SOLD OUT
            </div>
          )}
        </div>
  
        <div className="p-6">
  
          <h2 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h2>
  
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
  
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
            <span>
              📅 {new Date(event.start_datetime).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </span>
            <span className="w-1 h-1 bg-gray-600 rounded-full" />
            <span className={isSoldOut ? "text-red-400" : "text-green-400"}>
              {isSoldOut ? "Sold out" : `${event.available_seats} seats left`}
            </span>
          </div>
  
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${event.price}</span>
            <Link
              to={`/events/${event.id}`}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition
                ${isSoldOut
                  ? "bg-white/10 text-gray-400 cursor-not-allowed pointer-events-none"
                  : "bg-white text-black hover:scale-[1.03]"
                }`}
            >
              {isSoldOut ? "Sold Out" : "View & Book"}
            </Link>
          </div>
  
        </div>
      </div>
    );
  }