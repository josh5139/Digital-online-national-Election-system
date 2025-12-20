import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  function handle(e) {
    e.preventDefault();

    // Demo authentication — replace with real API call
    if (id === "admin" && pass === "1234") {
      localStorage.setItem("auth", "true");
      localStorage.setItem("role", "admin");
      navigate("/admin");
    } else if (id && pass) {
      localStorage.setItem("token", "voter-demo-token");
      localStorage.setItem("role", "voter");
      navigate("/ballots");
    } else {
      alert("Enter credentials or create an account");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handle} className="space-y-4">
          <input
            className="w-full p-3 rounded-lg border"
            placeholder="National ID / Username"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 rounded-lg border"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
            Sign In
          </button>
        </form>

        <div className="mt-4 text-right">
          <Link to="/forgot-password" className="text-blue-500 hover:underline text-sm">
            Forgot Password?
          </Link>
        </div>

        {/* Navigate to full registration page */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
