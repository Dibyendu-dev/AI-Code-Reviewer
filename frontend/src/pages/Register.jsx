import { useState } from "react";
import { register } from "../api/auth";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    alert("Registered Successfully");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 shadow-lg">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setForm({...form, email: e.target.value})}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setForm({...form, password: e.target.value})}
        />
        <button className="bg-blue-500 text-white p-2 w-full">
          Register
        </button>
      </form>
    </div>
  );
}