import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
    const [nationalId, setNationalId] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/voters/forgot-password", {
                nationalId,
                email,
            });
            setMessage(
                "If your account exists, a password reset link has been sent to your email."
            );
        } catch (err) {
            setMessage(
                "If your account exists, a password reset link has been sent to your email."
            ); // Do not reveal error for security
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

                {message && <p className="bg-green-100 text-green-700 p-2 mb-4 rounded">{message}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700">National ID</label>
                    <input
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Registered Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Send Reset Link
                </button>
            </form>
        </div>
    );
}
