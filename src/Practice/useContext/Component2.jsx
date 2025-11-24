import React, { useContext } from 'react'
import { userContext } from './Component1'

export default function Component2() {
    const name = useContext(userContext)
  return (
    <div>
      my name is {name}
    </div>
  )
}
