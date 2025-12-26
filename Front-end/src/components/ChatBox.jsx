import React, { useEffect, useState } from 'react'
import MsgBox from './MsgBox'
import Toggle from './Toggle'
import API from '../services/api';
import socket from '../socket/socket';

export default function ChatBox({chat}) {
    const[messages , setMessages] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"))

    useEffect(()=>{
        if(!chat)return
        const fetchMessages = async ()=>{
            try{
                const res = await API.get(`/message/${chat._id}`)
                setMessages(res.data)
            }catch(err){
                console.log("Error fetching message" , err);
            }
        }
        fetchMessages()
        socket.emit("joinChat" , chat._id)
    },[chat])

    useEffect(()=>{
        socket.on("messageReceived" , (newMessage)=>{
            if(newMessage.chat._id === chat._id){
                setMessages((prev)=>[...prev , newMessage])
            }
        })
        return ()=>{socket.off("messageReceived")}
    },[chat])

//     useEffect(() => {
//   if (!chat) return;

//   socket.emit("joinChat", chat._id);

// }, [chat]);
    const handleNewMessage = (message)=>{
        setMessages((prev)=>[...prev , message])
    }
    const otherUser = chat.users.find(
        (u)=>u._id !== (user._id || user.id)
    )

  return (
    <>
    <div className="box">
        <div className="head">
            <h4>{otherUser?.username}</h4>
            <Toggle/>
        </div>

        <div className="messages">
            {messages.map((msg)=>{
                const isMessage = msg.sender._id===user._id || msg.sender._id === user.id
                return(
                    <div key={msg._id} style={isMessage ? styles.user1 : styles.user2}>
                        {msg.content}
                    </div>
                )
            })}
            {/* <div className="user1">Hii</div>
            <div className="user2">Hello</div> */}
        </div>
        <MsgBox chat={chat} onMessageSent={handleNewMessage}/>
    </div>
    </>
  )
}
const styles = {
    user1 : {
        alignSelf : "flex-end",
        background : "var(--user1-bg)",
        padding: "8px",
        margin: "5px",
        borderRadius: "5px",
        width: "fit-content",
    },
    user2 : {
        alignSelf: "flex-start",
        background: "var(--user2-bg)",
        padding: "8px",
        margin: "5px",
        borderRadius: "5px",
        width: "fit-content",
    }
}
