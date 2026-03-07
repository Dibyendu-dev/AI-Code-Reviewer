import { useState } from "react";
import { register } from "../api/auth";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const resp = await register(form);
    alert("Registered Successfully");
  } catch (err) {
    console.error(err.response?.data || err);
    alert("Registration failed: " + JSON.stringify(err.response?.data));
  }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            AI Code Analyzer
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Join us today and get started
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition duration-200"
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition duration-200"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>
        </div>

        <button className="w-full mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 shadow-lg">
          Create Account
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition duration-200">
              Login here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}