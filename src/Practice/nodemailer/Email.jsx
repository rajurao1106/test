import React, { useState } from "react";

export default function Email() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeHandle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const enquiryHandle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    // Simple validation
    if (!form.name || !form.phone || !form.service || !form.message) {
      setStatus("❌ Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:1337/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("✅ Email sent successfully!");
        setForm({ name: "", phone: "", service: "", message: "" });
      } else {
        setStatus("❌ Failed to send email. Try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Server error. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={enquiryHandle}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Send Enquiry</h2>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChangeHandle}
            placeholder="Your full name"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onChangeHandle}
            placeholder="Your phone number"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Service</label>
          <select
            name="service"
            value={form.service}
            onChange={onChangeHandle}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select a service
            </option>
            <option value="Consulting">Consulting</option>
            <option value="Web Development">Web Development</option>
            <option value="App Development">App Development</option>
            <option value="SEO Optimization">SEO Optimization</option>
            <option value="Digital Marketing">Digital Marketing</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={onChangeHandle}
            placeholder="Your message..."
            rows="4"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>

        {status && (
          <p
            className={`text-center mt-3 font-medium ${
              status.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
