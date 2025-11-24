import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
{
  /* learning Projects */
}
import Home from "./Practice/CRUD/Home";
import Auth from "./Practice/authentication/Auth";
import UploadAndShow from "./Practice/multer/UploadAndShow";
import Email from "./Practice/nodemailer/Email";
import Signup from "./Practice/jwt/Signup";
import Login from "./Practice/jwt/Login";
import Protected from "./Practice/jwt/Protected";
import Stripe from "./Practice/stripe/Stripe";
import Test from "./Practice/test/Test";
import Redux from "./Practice/redux/Redux";
import To_Do_App from "./Practice/todoApp/ToDoApp";
import PrivateRoute from "./Practice/jwt/PrivateRoute";
import Sql from "./Practice/sql/Sql";
import Component1 from "./Practice/useContext/Component1";
import Component2 from "./Practice/useContext/Component2";
import ToDoApp from "./Projects/Frontend/To Do App/ToDoApp";
import ThemeContext from "./Projects/Frontend/To Do App/ThemeContext";
import Calculator from "./Projects/Frontend/Calculator";
import WeatherApp from "./Projects/Frontend/WeatherApp";
import ExpenseTracker from "./Projects/Frontend/Expense Tracker/ExpenseTracker";
import EnglishLearner from "./Projects/Frontend/English Learner/EnglishLearner";

export default function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <ThemeContext>
        <Routes>
          {/* learning Projects */}
          <>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/image" element={<UploadAndShow />} />
            <Route path="/email" element={<Email />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/context1" element={<Component1 />} />
            <Route path="/context2" element={<Component2 />} />
            <Route path="/payment" element={<Stripe />} />
            <Route path="/test" element={<Test />} />
            <Route path="/redux" element={<Redux />} />
            <Route path="/sql" element={<Sql />} />
            <Route path="/todo-app" element={<To_Do_App />} />
            <Route path="/english-learner" element={<EnglishLearner />} />
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <Protected />
                </PrivateRoute>
              }
            />
          </>

          {/* Practice Projects */}

          {/* Frontend */}
          <Route path="/to-do-app" element={<ToDoApp />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/weather-app" element={<WeatherApp />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
        </Routes>
      </ThemeContext>
    </BrowserRouter>
  );
}
