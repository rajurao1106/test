import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [input, setInput] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onchangeHandle = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandle = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:1337/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: input.username, password: input.password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/student-form");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Server error, try again later.");
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-7 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-5 text-center">Login</h2>

        {error && (
          <p className="bg-red-200 text-red-800 p-2 rounded mb-3 text-center">
            {error}
          </p>
        )}

        <form onSubmit={loginHandle} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={input.username}
            onChange={onchangeHandle}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={input.password}
            onChange={onchangeHandle}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
          <a href="/signup">Signup</a>
        </form>
      </div>
    </div>
  );
}
