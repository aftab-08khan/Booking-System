import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post(
        "/auth/login/",
        {
          username: form.username,
          password: form.password,
        }
      );

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      navigate("/dashboard");

    } catch (error) {
      console.log("Login error:", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        
        <h1 className="text-4xl font-bold mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-300 mb-8">
          Login to continue
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Username"
            className="p-4 rounded-xl bg-black/30 border border-gray-700 outline-none focus:border-white"
            onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="p-4 rounded-xl bg-black/30 border border-gray-700 outline-none focus:border-white"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="bg-white text-black font-semibold py-4 rounded-xl hover:scale-[1.02] transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-300">
          Don't have an account?

          <Link
            to="/register"
            className="ml-2 text-white font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;