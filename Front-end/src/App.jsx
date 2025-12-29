import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Register from './pages/Register'
import PrivateRoute from './components/PrivateRoute'
import API from './services/api'
import Loading from './components/Loading'

function App() {
  const [server, setServer] = useState(false)

  useEffect(()=>{
    const wakeServer = async() =>{
      try {
        await API.get('/')
        setServer(true)
      } catch (error) {
        setServer(true)
      }
    }
    wakeServer()
  },[])
  if(!server){
    return <Loading/>
  }

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
