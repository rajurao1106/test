// App.jsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51SM4ToArVEKhuEoP6cHKXQUqQSXYcf5eXUnK4efkeHaiF5UoTZTSo5X2eOb3bM8CuL39QQKzj8sGRuzMYu0kOO4g00b7RlnGKf");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(1000); // default $10
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!stripe || !elements) return;

    if (amount <= 0) {
      setMessage("Amount must be greater than $0");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const { clientSecret, error } = await res.json();

      if (error) {
        setMessage(error);
        setLoading(false);
        return;
      }

      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (stripeError) {
        setMessage(stripeError.message);
      } else if (paymentIntent?.status === "succeeded") {
        setMessage("🎉 Payment successful!");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Pay ${(amount / 100).toFixed(2)}</h2>

      <input
        type="number"
        min="1"
        value={amount / 100}
        onChange={(e) => setAmount(Math.round(e.target.value * 100))}
        placeholder="Enter amount"
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />

      <CardElement options={{ hidePostalCode: true, style: { base: { fontSize: "16px" } } }} />

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: loading ? "#ccc" : "#6772e5",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </button>

      {message && <p style={{ marginTop: "1rem", color: message.includes("successful") ? "green" : "red" }}>{message}</p>}
    </form>
  );
};

export default function Stripe() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
