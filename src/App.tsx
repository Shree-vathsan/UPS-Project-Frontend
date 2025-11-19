import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <p className='text-red-500'>Hi aksbdfaidfvhia</p> */}
    <Login/>
    </>
  )
}

export default App
