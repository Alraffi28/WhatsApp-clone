import React, { useEffect, useState } from 'react'
import API from '../services/api';
import NewChat from './NewChat';

export default function ChatList({setSelectedChat}) {
    const [chats , setChats] = useState([]);
    const [show , setShow] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(()=>{
        const fetchChat = async () =>{
            try{
                const res = await API.get("/chat")
                setChats(res.data)
            }catch(error){
                console.log("Error fetching chats" , error);
            }
        }
        fetchChat()
    }, [])
  return (
   <>
   <div style={{padding:"15px"}}>
    <h3>CHATS</h3>
    <button onClick={()=>setShow(true)}>New Chat</button>
    {
        chats.map((chat)=>{
            const otherUser = chat.users.find(
                (u)=>u._id !== (user._id || user.id)
            )
            if(!otherUser) return null
            return(
                <div key={chat._id} className='chat-style' onClick={()=>setSelectedChat(chat)}>
                    <strong>{otherUser?.username}</strong>
                    <p style={{margin : 0 , fontSize : "12px"}}>
                        {chat.latestMessage?.content || "No message yet"}
                    </p>
                </div>
            )
        })
    }
    {show && (
        <NewChat close={()=>setShow(false)}
        addChat={(chat)=>{
            setChats((prev) => [chat , ...prev])
            setShow(false)
        }}/>
    )}
    
   </div>
   </>
  )
}
