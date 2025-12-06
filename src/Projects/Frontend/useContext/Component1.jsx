import React, { createContext } from 'react'
import Component2 from './Component2'

 export const userContext = createContext()

 const name = "Raju Rao"

export default function Component1() {
 
  return (
    <userContext.Provider value={name}>
      coponent1
      <Component2/>
    </userContext.Provider>
  )
}
