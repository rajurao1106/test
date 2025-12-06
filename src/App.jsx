import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
{
  /* learning Projects */
}
import Home from "./Projects/Backend/CRUD/Home";
import Auth from "./Projects/Backend/authentication/Auth";
import UploadAndShow from "./Projects/Backend/multer/UploadAndShow";
import Email from "./Projects/Backend/nodemailer/Email";
// import Signup from "./Projects/jwt/Signup";
// import Login from "./Projects/jwt/Login";
// import Protected from "./Projects/jwt/Protected";
// import PrivateRoute from "./Projects/jwt/PrivateRoute";
import Stripe from "./Projects/Backend/stripe/Stripe";
import Test from "./Practice/test/Test";
import Redux from "./Projects/Backend/redux/Redux";
import To_Do_App from "./Projects/Frontend/todoApp/ToDoApp";
import Sql from "./Projects/Backend/sql/Sql";
import Component1 from "./Projects/Frontend/useContext/Component1";
import Component2 from "./Projects/Frontend/useContext/Component2";
import ToDoApp from "./Projects/Frontend/To Do App/ToDoApp";
import ThemeContext from "./Projects/Frontend/To Do App/ThemeContext";
import Calculator from "./Projects/Frontend/Calculator";
import WeatherApp from "./Projects/Frontend/WeatherApp";
import ExpenseTracker from "./Projects/Frontend/Expense Tracker/ExpenseTracker";
import EnglishLearner from "./Projects/Frontend/English Learner/EnglishLearner";
import Login from "./Practice/jwt/Login";
import Signup from "./Practice/jwt/Signup";
import PrivateRoute from "./Practice/jwt/PrivateRoute";
import StudentForm from "./Practice/jwt/StudentForm";

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
            <Route path="/context1" element={<Component1 />} />
            <Route path="/context2" element={<Component2 />} />
            <Route path="/payment" element={<Stripe />} />
            <Route path="/test" element={<Test />} />
            <Route path="/redux" element={<Redux />} />
            <Route path="/sql" element={<Sql />} />
            <Route path="/todo-app" element={<To_Do_App />} />
            <Route path="/english-learner" element={<EnglishLearner />} />
            {/* <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/protected"
              element={
                <PrivateRoute>
                  <Protected />
                </PrivateRoute>
              }
            /> */}
          </>

          {/* Projects */}

          {/* Frontend */}
          <Route path="/to-do-app" element={<ToDoApp />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/weather-app" element={<WeatherApp />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />

          {/* Practice */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/student-form"
            element={
              <PrivateRoute>
                <StudentForm />
              </PrivateRoute>
            }
          />
        

        </Routes>
      </ThemeContext>
    </BrowserRouter>
  );
}
