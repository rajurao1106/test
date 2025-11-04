import React from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Protected() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100 text-center">
        <ShieldCheck className="text-indigo-600 w-10 h-10 mx-auto mb-2" />
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
          Welcome to Protected Page
        </h2>
        <p className="text-gray-600 mb-6">
          You have access because your token is valid.
        </p>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-xl transition"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Protected;
