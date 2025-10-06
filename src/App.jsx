import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [initial,useInitial]=useState(0);

  return (
    <>
          <h1>{initial}</h1>

    <button onClick={()=>useInitial(initial+1)}>Click</button>
    
    </>
  )
}

export default App
