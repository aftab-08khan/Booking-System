import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await API.post("auth/register/", form);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Username or email may already be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-4xl font-bold mb-2">Create Account</h1>

        <p className="text-gray-300 mb-8">Sign up to get started</p>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="p-4 rounded-xl bg-black/30 border border-gray-700 outline-none focus:border-white transition"
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="p-4 rounded-xl bg-black/30 border border-gray-700 outline-none focus:border-white transition"
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="p-4 rounded-xl bg-black/30 border border-gray-700 outline-none focus:border-white transition"
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black font-semibold py-4 rounded-xl hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="mt-6 text-gray-300">
          Already have an account?
          <Link to="/login" className="ml-2 text-white font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default RegisterPage;