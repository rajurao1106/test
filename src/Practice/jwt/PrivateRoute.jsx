import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [authenticate, setAuthenticate] = useState(null);
  const navigate = useNavigate();

  const authHandle = async () => {
    const token = localStorage.getItem("token");
     if(!token){
      setAuthenticate(false)
    }

    const res = await fetch("http://localhost:1337/protected", {
      headers: { Authorization: token },
    });

    if (res.ok) {
      setAuthenticate(true);
    } else {
      setAuthenticate(false);
    }
  };

  useEffect(() => {
    authHandle();
  }, []);

  if (!authenticate) {
    navigate("/login");
  }

  return children;
}
