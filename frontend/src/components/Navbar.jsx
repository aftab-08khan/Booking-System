import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10 text-white px-8 py-4 flex justify-between items-center">

      <Link
        to="/"
        className="text-2xl font-bold tracking-wide"
      >
        EventHub
      </Link>

      <div className="flex gap-4 items-center">

        <Link
          to="/"
          className="hover:text-gray-300 transition"
        >
          Events
        </Link>

        {token ? (
          <>
            <Link
              to="/dashboard"
              className="hover:text-gray-300 transition"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-gray-300 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;