import React, { useEffect, useState } from "react";

export default function Home() {
  const [form, setForm] = useState({ name: "", age: "", address: "" });
  const [result, setResult] = useState([]);

  const onchangeHandle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendData = async () => {
    try {
      const res = await fetch("http://localhost:1337/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setForm((prev) => prev[{ ...result, form }]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:1337/get");
      const data = await res.json();
      setResult(data.data);
      setForm({ name: "", age: "", address: "" });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <form onSubmit={sendData}>
        <label htmlFor="">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={onchangeHandle}
        />
        <label htmlFor="">Age</label>
        <input
          type="text"
          name="age"
          value={form.age}
          onChange={onchangeHandle}
        />
        <label htmlFor="">Address</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={onchangeHandle}
        />
        <input type="submit" />
      </form>
      {result.map((item, index) => (
        <div key={index} className="">
          <p>{item.name}</p>
          <p>{item.age}</p>
          <p>{item.address}</p>
        </div>
      ))}
      <a href="https://test-sry7.vercel.app/english-learner">english-learner</a>
    </div>
  );
}
