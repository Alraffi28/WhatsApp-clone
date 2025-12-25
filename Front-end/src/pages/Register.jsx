import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

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
    <div>
        <form action="" onSubmit={handleRegister}>
            <h2>REGISTER</h2>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder=' Enter your name' autoComplete='off' required/>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder=' Enter your mail' autoComplete='off' required/>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder=' Enter your password' autoComplete='off' required/>
            <button type='submit'>Sign up</button>
            <p>Already have an account ? <Link to='/'>Login</Link></p>

        </form>
    </div>
  )
}
