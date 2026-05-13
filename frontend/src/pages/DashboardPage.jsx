import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";
import { 
  FiCalendar, 
  FiDollarSign, 
  FiLogOut, 
  FiPlus, 
  FiBookmark, 
  FiCheckCircle, 
  FiClock,
  FiTrello,
  FiShoppingBag
} from "react-icons/fi";
import { MdEvent, MdPending } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";

function DashboardPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchBookings();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await API.get("/auth/profile/");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings/");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending", icon: <MdPending className="w-3 h-3 mr-1" /> },
      confirmed: { color: "bg-green-100 text-green-800", label: "Confirmed", icon: <FiCheckCircle className="w-3 h-3 mr-1" /> },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled", icon: <FiLogOut className="w-3 h-3 mr-1" /> },
      failed: { color: "bg-gray-100 text-gray-800", label: "Failed", icon: <FiLogOut className="w-3 h-3 mr-1" /> },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || "User"}!
          </h1>
          <p className="text-gray-600">
            Manage your bookings and explore new events
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            to="/add-event"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg text-center inline-flex items-center justify-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Create New Event
          </Link>
          
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FiBookmark className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending Payment</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 inline-flex items-center gap-2">
              <FiTrello className="w-5 h-5" />
              My Bookings
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-500">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">
              <FiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">You haven't made any bookings yet</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <FiBookmark className="w-4 h-4" />
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.event?.title || "Event"}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegCalendarAlt className="w-4 h-4" />
                          <span>{new Date(booking.event?.start_datetime).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="w-4 h-4" />
                          <span>${booking.event?.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => {/* Handle payment */}}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all inline-flex items-center gap-2"
                        >
                          <FiDollarSign className="w-4 h-4" />
                          Complete Payment
                        </button>
                      )}
                      <Link
                        to={`/events/${booking.event?.id}`}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all inline-flex items-center gap-2"
                      >
                        <MdEvent className="w-4 h-4" />
                        View Event
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;