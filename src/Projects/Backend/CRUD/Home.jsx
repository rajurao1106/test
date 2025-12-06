import React, { useEffect, useState } from "react";

export default function Home() {
  const [input, setInput] = useState({ name: "", age: "", address: "" });
  const [result, setResult] = useState([]);
  const [editId, setEditId] = useState(null);

  const onchangeHandel = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const sendData = async (e) => {
    e.preventDefault();
    if (editId) return updateData();
    try {
      const res = await fetch("http://localhost:1337/send-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: input.name,
          age: Number(input.age),
          address: input.address,
        }),
      });
      const data = await res.json();
      setResult((prev) => [...prev, data.studentData]);
      setInput({ name: "", age: "", address: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const getData = async () => {
    try {
      const res = await fetch("http://localhost:1337/get-data");
      const data = await res.json();
      setResult(data.studentData);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteData = async (id) => {
    try {
      await fetch(`http://localhost:1337/delete-data/${id}`, {
        method: "DELETE",
      });
      setResult(result.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const takeData = (item) => {
    setInput({ name: item.name, age: item.age, address: item.address });
    setEditId(item._id);
  };

  const updateData = async () => {
    try {
      const res = await fetch(`http://localhost:1337/update-data/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: input.name,
          age: Number(input.age),
          address: input.address,
        }),
      });
      const data = await res.json();
      setResult(
        result.map((item) => (item._id === editId ? data.studentData : item))
      );
      setInput({ name: "", age: "", address: "" });
      setEditId(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <form onSubmit={sendData}>
        <input
          type="text"
          value={input.name}
          name="name"
          onChange={onchangeHandel}
          placeholder="Name"
        />
        <input
          type="number"
          value={input.age}
          name="age"
          onChange={onchangeHandel}
          placeholder="Age"
        />
        <input
          type="text"
          value={input.address}
          name="address"
          onChange={onchangeHandel}
          placeholder="Address"
        />
        <button type="submit">{editId ? "Update" : "Submit"}</button>
      </form>
      {result.map((item) => (
        <div key={item._id}>
          {item.name}-{item.age}-{item.address}{" "}
          <button onClick={() => takeData(item)}>Edit</button>
          <button onClick={() => deleteData(item._id)}>DELETE DATA</button>
        </div>
      ))}
    </div>
  );
}
