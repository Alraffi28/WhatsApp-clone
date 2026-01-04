import React, { useEffect, useState ,useRef } from 'react'
import MsgBox from './MsgBox'
import Toggle from './Toggle'
import API from '../services/api';
import socket from '../socket/socket';
import { IoIosArrowBack } from "react-icons/io";

export default function ChatBox({chat , goBack}) {
    const[messages , setMessages] = useState([]);
    const [menuMsgId , setMenuMsgId] = useState(null)
    const user = JSON.parse(localStorage.getItem("user"))
    const bottomRef = useRef(null)
    const longPress = useRef(null)

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior : "smooth"})
    },[messages])

    // mobile long press
    function StartLongPress(msgId){
        longPress.current = setTimeout(()=>{
            setMenuMsgId(msgId)
        },500)
    }
    function cancelLongPress(){
        if(longPress.current){
            clearTimeout(longPress.current)
            longPress.current = null
        }
    }

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

        const hdlDeleteEveryone = (updatedMessage) => {
            setMessages((prev)=>prev.map((m)=>m._id===updatedMessage._id?updatedMessage:m))
        }

        socket.on("messageReceived" , hdlMessageReceive)
        socket.on("messageDeleted" , hdlDeleteEveryone)
        return ()=>{socket.off("messageReceived" , hdlMessageReceive)
                    socket.off("messageDeleted" , hdlDeleteEveryone)
        }
    },[chat])

    useEffect(()=>{
        const closeMenu = () => setMenuMsgId(null)
        document.addEventListener("click" ,closeMenu)
        return () => document.removeEventListener("click" , closeMenu)
    },[])

    const hdlDelete = async (messageId) =>{
        try {
            await API.delete(`/message/delete/${messageId}`);
            setMessages((prev) => prev.filter((m) => m._id !== messageId));
            setMenuMsgId(null);
        } catch (error) {
            console.log("Delete failed" , error)
        }
    }
    const hdlDeleteAll = async (messageId) => {
        try {
            const { data } = await API.put(`/message/delete-everyone/${messageId}`)
            setMessages((prev)=>
                prev.map((m)=>(m._id===data._id ? data : m))
            )
            socket.emit("deleteMessageEveryone" , {messageId})
            setMenuMsgId(null)
            } catch (error) {
                console.log("Delete for everyone failed");
            }
        };
        if(!chat) return null;

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
                    <div key={msg._id} className={`message ${isMessage ? "user1" : "user2"}`}
                        onContextMenu={(e)=>{
                            e.preventDefault()
                            e.stopPropagation()
                            setMenuMsgId(msg._id)
                        }}
                        onTouchStart={()=>StartLongPress(msg._id)} onTouchEnd={cancelLongPress} onTouchMove={cancelLongPress}
                    >
                        {chat.isGroupChat && !isMessage && (
                            <div className="sender-name">{msg.sender.username}</div>
                        )}
                        <span className="msg-text">{msg.isDeleted ? (
                            <em style={{color : "var(--empty)"}}>This message was deleted</em>
                        ) :( msg.content)}</span>
                        <span className="msg-time">
                            {new Date(msg.createdAt).toLocaleTimeString([],{
                                hour:"2-digit",
                                minute :"2-digit"
                            })}
                        </span>
                        {/* delete */}
                        {menuMsgId === msg._id && (
                            <div className={`msg-popup ${isMessage ? "right" : "left"}`}>
                                <button  onClick={()=>hdlDelete(msg._id)}>Delete for me</button>
                            {isMessage && !msg.deleted && (
                                <button onClick={()=>hdlDeleteAll(msg._id)} className='danger'>Delete for everyone</button>
                            )}
                            </div>
                        )}
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

