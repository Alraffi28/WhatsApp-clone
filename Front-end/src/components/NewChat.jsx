import React, { useEffect, useState } from 'react'
import API from '../services/api'

export default function NewChat({close , addChat}) {
    const[users , setUsers] = useState([])

    useEffect(()=>{
        const fetchUsers = async()=>{
            try{
                const res = await API.get('/users')
                setUsers(res.data)
            }catch(err){
                console.log("error fetching users" , err);
            }
        }
        fetchUsers()
    },[])
    async function startChat(userId) {
        try {
            const res = await API.post("/chat" , {userId})
            addChat(res.data)
        } catch (error) {
            console.log("error creating chat" , error);
        }
    }
  return (
    <>
    <div className="overlay">
        <div className="modal">
            <h3>Start New Chat</h3>
            {users.map((user)=>(
                <div className="user" key={user._id} onClick={()=>startChat(user._id)}>{user.username}</div>
            ))}
            <button onClick={close}>Close</button>
        </div>
    </div>
    </>
  )
}
