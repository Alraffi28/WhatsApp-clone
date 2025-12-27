import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import API from "../services/api";
import { useEffect } from "react";
import { FaLock } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { MdError } from "react-icons/md";
import '../login.css'

export default function Login(){
    const [email , setEmail] = useState('');
    const[password , setPassword] = useState('');
    const[error , setError] = useState('');
    const navigate = useNavigate()

    const handleLogin = async (e) =>{
        e.preventDefault()
        setError('')
        try {
            const {data} = await API.post("/login" , 
                {email , password}
            )
            // save token at local storage
            localStorage.setItem("token" , data.token)
            localStorage.setItem("user" , JSON.stringify(data.user))

            navigate("/chat")
        } catch (error) {
            setError(error.response?.data?.message || "Login failed")
        }
    }
    useEffect(()=>{
        setEmail("")
        setPassword("")
    },[])
    
    return(
        <>
        <div className="login">
            <form action="" onSubmit={handleLogin}>
                <h1>LOGIN</h1>
                <div className="input-box">
                    <input type="email" value={email} name="email" onChange={(e)=>setEmail(e.target.value)} placeholder=" Enter your mail" autoComplete='off' required />
                    <span><IoIosMail size={25}/></span>
                </div>
                <div className="input-box">
                    <input type="password" value={password} name="password" onChange={(e)=>setPassword(e.target.value)} placeholder=" Enter your password" autoComplete='off' required/>
                    <span><FaLock size={20}/></span>
                </div>
                {
                    error && (<div className="error-msg">
                                <p><MdError size={20}/></p>
                                <p>{error}</p>
                            </div>)
                }
                <button type="submit">Login</button>
                <div className="link">
                    <p>Don't have an account ? <Link to='/register'>Sign up</Link></p>
                </div>
            </form>
        </div>
        </>
    )
}