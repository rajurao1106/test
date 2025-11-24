import React from 'react'

export default function Test() {
  const object = {name:"raju"}
  localStorage.setItem("object", JSON.parse(object))
  return (
    <div>
      
    </div>
  )
}
