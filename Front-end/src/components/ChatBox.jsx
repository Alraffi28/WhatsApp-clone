import React, { useEffect, useState ,useRef } from 'react'
import MsgBox from './MsgBox'
import Toggle from './Toggle'
import API from '../services/api';
import socket from '../socket/socket';
import { IoIosArrowBack } from "react-icons/io";

export default function ChatBox({chat , goBack}) {
    const[messages , setMessages] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"))

    const bottomRef = useRef(null)
    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior : "smooth"})
    },[messages])

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
        if (socket.connected) {
            socket.emit("joinChat", chat._id);
        }  else {
            socket.on("connect", () => {
             socket.emit("joinChat", chat._id);
        });
  }
},[chat])

    useEffect(()=>{
        const hdlMessageReceive = (newMessage) =>{
            if (newMessage.chat._id === chat?._id) {
            setMessages((prev) => [...prev, newMessage]);
            }
        }
        socket.on("messageReceived" , hdlMessageReceive)
        return ()=>{socket.off("messageReceived" , hdlMessageReceive)}
    },[chat])

//     useEffect(() => {
//   if (!chat) return;

//   socket.emit("joinChat", chat._id);

// }, [chat]);
    const handleNewMessage = (message)=>{
        setMessages((prev)=>[...prev , message])
    }

    const otherUser = !chat.isGroupChat
    ? chat.users.find(
        (u)=>u._id !== (user._id || user.id)
    )
    : null;
    const chatTitle = chat.isGroupChat
    ? chat.chatName
    : otherUser?.username;

  return (
    <>
    <div className="box">
        <div className="head">
            {goBack && (
                <button className='back-btn' onClick={goBack}><IoIosArrowBack size={20}/></button>
            )}
            <h3>{chatTitle}</h3>
            <Toggle/>
        </div>

        <div className="messages">
            {messages.map((msg)=>{
                const isMessage = msg.sender._id===user._id || msg.sender._id === user.id
                return(
                    <div key={msg._id} className={`message ${isMessage ? "user1" : "user2"}`}>
                        <span className="msg-text">{msg.content}</span>
                        <span className="msg-time">
                            {new Date(msg.createdAt).toLocaleTimeString([],{
                                hour:"2-digit",
                                minute :"2-digit"
                            })}
                        </span>
                    </div>
                )
            })}
            <div ref={bottomRef}></div>
            {/* <div className="user1">Hii</div>
            <div className="user2">Hello</div> */}
        </div>
        
        <div className="chat-input">
            <MsgBox chat={chat} onMessageSent={handleNewMessage}/>
        </div>
    </div>
    </>
  )
}

