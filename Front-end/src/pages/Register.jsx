import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { IoIosMail } from "react-icons/io"
import { FaUser , FaLock } from 'react-icons/fa';
import '../login.css'

export default function Register() {
    const navigate = useNavigate();
    const [name , setName] = useState('')
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')

    const handleRegister = async (e)=>{
        e.preventDefault()
        try {
                await API.post("/register" , {
                username : name , email , password,
            })
            alert("Registered Successfully")
            navigate('/')
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed")
        }
    }
  return (
    <div className='login'>
        <form action="" onSubmit={handleRegister}>
            <h1>REGISTER</h1>
            <div className="input-box">
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder=' Enter your name' autoComplete='off' required/>
                <span><FaUser size={20}/></span>
            </div>
            <div className="input-box">
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder=' Enter your mail' autoComplete='off' required/>
                <span><IoIosMail size={25}/></span>
            </div>
            <div className="input-box">
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder=' Enter your password' autoComplete='off' required/>
                <span><FaLock size={20}/></span>
            </div>
            <button type='submit'>Sign up</button>
            <div className="link">
                <p>Already have an account ? <Link to='/'>Login</Link></p>
            </div>
        </form>
    </div>
  )
}
