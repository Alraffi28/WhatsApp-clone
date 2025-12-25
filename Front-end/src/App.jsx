import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Register from './pages/Register'
import PrivateRoute from './components/PrivateRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/chat' element={
          <PrivateRoute>
            <Chat/>
          </PrivateRoute>
          }/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
