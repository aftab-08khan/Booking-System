import { Link, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiCalendar, FiArrowRight } from "react-icons/fi";
import { MdEvent, MdDashboard } from "react-icons/md";

function SuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

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

          <p className="text-gray-600 mt-2">
            Your booking has been confirmed successfully.
          </p>

          {sessionId && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 break-all font-mono">
                Session ID: {sessionId}
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <Link
              to="/dashboard"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <MdDashboard className="w-5 h-5" />
              Go to Dashboard
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

export default SuccessPage;