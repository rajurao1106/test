import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentForm() {
  const [input, setInput] = useState({ name: "", age: "", address: "" });
  const [result, setResult] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const logoutHandle = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const onchangeHandle = (e) => {
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
          address: input.address 
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
      console.error(error);
    }
  };

  const deleteData = async (id) => {
    await fetch(`http://localhost:1337/delete-data/${id}`, {
      method: "DELETE",
    });
    setResult((prev) => prev.filter((item) => item._id !== id));
  };

  const editData = (item) => {
    setInput(item);
    setEditId(item._id);
  };

  const updateData = async () => {
    const res = await fetch(`http://localhost:1337/update-data/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await res.json();
    setResult((prev) =>
      prev.map((item) => (item._id === editId ? data.studentData : item))
    );

    setInput({ name: "", age: "", address: "" });
    setEditId(null);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Form */}
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-5 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {editId ? "Update Student" : "Add Student"}
        </h2>

        <form onSubmit={sendData} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={input.name}
            name="name"
            onChange={onchangeHandle}
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            placeholder="Age"
            value={input.age}
            name="age"
            onChange={onchangeHandle}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Address"
            value={input.address}
            name="address"
            onChange={onchangeHandle}
            className="w-full border rounded p-2"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            {editId ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      <div className="text-center mb-4">
        <button
          onClick={logoutHandle}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Table */}
      <div className="max-w-2xl mx-auto">
        {result.length > 0 ? (
          <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Age</th>
                <th className="p-3">Address</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.age}</td>
                  <td className="p-3">{item.address}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => editData(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteData(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No record found.</p>
        )}
      </div>
    </div>
  );
}
