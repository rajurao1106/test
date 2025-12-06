import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [input, setInput] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const onchangeHandle = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandle = async (e) => {
      e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: input.username,
          password: input.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/protected");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={input.username}
          name="username"
          onChange={onchangeHandle}
        />
        <input
          type="text"
          value={input.password}
          name="password"
          onChange={onchangeHandle}
        />
        <button onClick={loginHandle}>Login</button>
      </div>
    </div>
  );
}
