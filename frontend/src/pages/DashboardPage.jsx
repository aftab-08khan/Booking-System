import { Link, useNavigate } from "react-router-dom";

function DashboardPage() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">

      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10">

        <h1 className="text-4xl font-bold mb-4">
          User Dashboard
        </h1>
        <Link
  to="/add-event"
  className="inline-block bg-blue-600 px-4 py-2 rounded-xl mb-6"
>
  + Add Event
</Link>
        <p className="text-gray-300 mb-8">
          Manage your bookings and account.
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default DashboardPage;