import React, { useState } from 'react'
import API from '../services/api';
import socket from '../socket/socket';
import {IoSend} from 'react-icons/io5'

export default function MsgBox({chat , onMessageSent}) {
    const[content , setContent] = useState("");

    const sendMessage = async ()=>{
        if(!content.trim()) return;
        try {
            const res = await API.post("/message" , {
                content,chatId : chat._id
            })
            // onMessageSent(res.data)
            socket.emit("newMessage" , res.data)
            setContent('')
        } catch (error) {
            console.log("Error sending msgg" , error)
        }
    }
  return (
    <>
    <div className='msg-box'>
        <input type="text" placeholder=' Type your message' value={content} 
        onChange={(e)=>setContent(e.target.value)}/>
        <button onClick={sendMessage}><IoSend size={20} /></button>
    </div>
    </>
  )
}
