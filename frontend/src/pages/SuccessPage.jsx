import { Link, useSearchParams } from "react-router-dom";

function SuccessPage() {
  const [params] = useSearchParams();

  const sessionId = params.get("session_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">

      <div className="w-full max-w-md text-center bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-10 shadow-2xl">

        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white">
          Payment Successful
        </h1>

        <p className="text-slate-400 mt-3">
          Your booking has been confirmed successfully.
        </p>

        {/* Session ID (optional debug) */}
        {sessionId && (
          <p className="text-xs text-slate-500 mt-4 break-all">
            Session ID: {sessionId}
          </p>
        )}

        {/* Buttons */}
        <div className="mt-8 space-y-3">

          <Link
            to="/dashboard"
            className="block bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-medium"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/"
            className="block bg-white/10 hover:bg-white/20 transition py-3 rounded-xl font-medium"
          >
            Browse More Events
          </Link>

        </div>

      </div>

    </div>
  );
}

export default SuccessPage;