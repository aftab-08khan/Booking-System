import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiDollarSign, FiUsers, FiFileText, FiPlus } from "react-icons/fi";
import { MdTitle } from "react-icons/md";
import API from "../api/axios";

function AddEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_datetime: "",
    end_datetime: "",
    price: "",
    capacity: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate datetime fields
    if (new Date(form.start_datetime) >= new Date(form.end_datetime)) {
      setError("End date must be after start date");
      setLoading(false);
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem("access");
    if (!token) {
      setError("You need to be logged in to create events. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      setLoading(false);
      return;
    }

    try {
      // Use the same events endpoint - it should accept POST
      const response = await API.post("/events/", {
        title: form.title,
        description: form.description,
        start_datetime: form.start_datetime,
        end_datetime: form.end_datetime,
        price: Number(form.price),
        capacity: Number(form.capacity),
        is_active: true, // Set as active by default
      });

      console.log("Event created successfully:", response.data);
      navigate("/");
      
    } catch (error) {
      console.error("Error creating event:", error);
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          setError("Please login to create events. Redirecting...");
          setTimeout(() => navigate("/login"), 2000);
        } else if (error.response.status === 403) {
          setError("You don't have permission to create events.");
        } else if (error.response.status === 405) {
          setError("Method not allowed. Please check backend configuration.");
        } else if (error.response.data) {
          // Handle validation errors
          if (typeof error.response.data === 'object') {
            const errorMessages = Object.values(error.response.data).flat();
            setError(errorMessages.join(", "));
          } else {
            setError(error.response.data.message || "Failed to create event");
          }
        } else {
          setError("Failed to create event. Please try again.");
        }
      } else if (error.request) {
        setError("Network error. Please check if the server is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <FiPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Event
            </h1>
            <p className="text-gray-600 mt-2">
              Fill in the details to create an event
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Title *
            </label>
            <div className="relative">
              <MdTitle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="title"
                placeholder="Enter event title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <div className="relative">
              <FiFileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                name="description"
                placeholder="Describe your event"
                value={form.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
              />
            </div>
          </div>

          {/* Start Date & Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date & Time *
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="datetime-local"
                name="start_datetime"
                value={form.start_datetime}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
              />
            </div>
          </div>

          {/* End Date & Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date & Time *
            </label>
            <div className="relative">
              <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="datetime-local"
                name="end_datetime"
                value={form.end_datetime}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
              />
            </div>
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price ($) *
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
              />
            </div>
          </div>

          {/* Capacity Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Capacity *
            </label>
            <div className="relative">
              <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="capacity"
                type="number"
                min="1"
                placeholder="Number of seats"
                value={form.capacity}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Event...
              </>
            ) : (
              <>
                <FiPlus className="w-5 h-5" />
                Create Event
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEventPage;