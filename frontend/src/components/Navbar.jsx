import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            EventHub
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Events
            </Link>

            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Events
              </Link>

              {token ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 text-left mx-3"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 text-center mx-3"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;