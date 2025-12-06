import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PrivateRoute({children}) {
  const [authenticated, setAthenticated] = useState(null)
  const navigate = useNavigate()

  const authHandle = async() => {
    const token = localStorage.getItem("token")
    if(!token){
      setAthenticated(false)
    }

    const res = await fetch("http://localhost:5000/protected",{
      headers:{ Authorization: token}
    })
    if(res.ok){
      setAthenticated(true)
    }
    else{
      setAthenticated(false)
    }
  }
  
  useEffect(()=>{
authHandle()
  },[])

  if(!authenticated){
navigate("/login")
  }
  return (children)
}
