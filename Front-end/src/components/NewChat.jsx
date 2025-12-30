import React, { useEffect, useState } from 'react'
import API from '../services/api'
import CreateGroup from './CreateGroup'

export default function NewChat({close , addChat}) {
    const[users , setUsers] = useState([])
    const[group , setGroup] = useState(false)

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
            close()
        } catch (error) {
            console.log("error creating chat" , error);
        }
    }

    const openGroup = () =>{
        setGroup(true)
    }
  return (
    <>
    <div className="overlay">
        <div className="modal">
            <h2>Start New Chat</h2>
            <br />
            {!group &&
                users.map((user)=>(
                <div className="user" key={user._id}>
                    <p>{user.username}</p><button onClick={()=>startChat(user._id)} className='add-btn'>Chat</button>
                </div>
            ))}
            {!group && (
                <>
                <br />
                <button onClick={openGroup} className='new-btn'>Create Group</button>
                </>
            )}
            {group && (
                <CreateGroup
                close={()=>setGroup(false)}
                addChat={(chat)=>{
                    addChat(chat)
                    close()
                }}
                />
            )}
            <button onClick={close} className='new-btn'>Close</button>
        </div>
    </div>
    </>
  )
}
