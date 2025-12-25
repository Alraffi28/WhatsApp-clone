import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import API from "../services/api";
import { useEffect } from "react";

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
        <div>
            <form action="" onSubmit={handleLogin}>
                <h2>LOGIN</h2>
                <input type="email" value={email} name="email" onChange={(e)=>setEmail(e.target.value)} placeholder=" Enter your mail" autoComplete='off' required />
                <input type="password" value={password} name="password" onChange={(e)=>setPassword(e.target.value)} placeholder=" Enter your password" autoComplete='off' required/>
                {
                    error && (<p>{error}</p>)
                }
                <button type="submit">Login</button>
                <p>Don't have an account ? <Link to='/register'>Sign up</Link></p>
            </form>
        </div>
        </>
    )
}