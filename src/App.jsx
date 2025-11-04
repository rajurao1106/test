import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Projects/CRUD/Home";
import Auth from "./Projects/authentication/Auth";
import UploadAndShow from "./Projects/multer/UploadAndShow";
import Email from "./Projects/nodemailer/Email";
import Signup from "./Projects/jwt/Signup";
import Login from "./Projects/jwt/Login";
import Protected from "./Projects/jwt/Protected";
import Stripe from "./Projects/stripe/Stripe";
import Test from "./Projects/test/Test";
import Redux from "./Projects/redux/Redux";
import Navbar from "./Projects/components/Navbar";
import { ThemeProvider } from "./ThemeContext";
import PrivateRoute from "./Projects/jwt/PrivateRoute";


// Inside <Routes>

export default function App() {
  return (
    <BrowserRouter>
      {/* Wrap the entire app with the ThemeProvider */}
      <ThemeProvider>
        {/* Common components like Navbar can go here */}
        <Navbar />

        {/* Define all routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/image" element={<UploadAndShow />} />
          <Route path="/email" element={<Email />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/payment" element={<Stripe />} />
          <Route path="/test" element={<Test />} />
          <Route path="/redux" element={<Redux />} />
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <Protected />
              </PrivateRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
