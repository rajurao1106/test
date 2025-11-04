import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe("pk_test_51SM4ToArVEKhuEoP6cHKXQUqQSXYcf5eXUnK4efkeHaiF5UoTZTSo5X2eOb3bM8CuL39QQKzj8sGRuzMYu0kOO4g00b7RlnGKf"); // secret key from Stripe dashboard

// Create payment intent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
