import { useState, useEffect } from "react";

const API_URL = "https://test-9v8k.onrender.com"; // ✅ Change to your backend URL

export default function Sql() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  // ✅ Load users from backend
  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Handle form inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit user data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return alert("All fields required!");

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ name: "", email: "" }); // Reset
        fetchUsers(); // Refresh list
      } else {
        alert("Error creating user");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>✅ PostgreSQL Client</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Add User</button>
      </form>

      <h3>Users List</h3>
      <ul>
        {users.length > 0 ? (
          users.map((u) => (
            <li key={u.id}>
              {u.name} - {u.email}
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  );
}
