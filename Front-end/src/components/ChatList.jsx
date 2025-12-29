import React, { useEffect, useState } from 'react'
import API from '../services/api';
import NewChat from './NewChat';
import socket from '../socket/socket';

export default function ChatList({setSelectedChat,openNewChat,showNewChat,closeNewChat}) {
    const [chats , setChats] = useState([]);
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

    useEffect(() => {
  socket.on("messageReceived", (newMessage) => {
    setChats((prev) => {
      // find the chat that received new message
      const chatToUpdate = prev.find(
        (c) => c._id === newMessage.chat._id
      );

      // if chat not found, do nothing
      if (!chatToUpdate) return prev;

      // update latestMessage
      const updatedChat = {
        ...chatToUpdate,
        latestMessage: newMessage,
      };

      // remove old chat
      const remainingChats = prev.filter(
        (c) => c._id !== newMessage.chat._id
      );

      // move updated chat to top
      return [updatedChat, ...remainingChats];
    });
  });

  return () => socket.off("messageReceived");
}, []);

  return (
   <>
   <div className='chat-list'>
    <h3 style={{padding:"10px"}}>CHATS</h3>
    {!showNewChat &&
        chats.map((chat)=>{
            const otherUser = chat.users.find(
                (u)=>u._id !== (user._id || user.id)
            )
            if(!otherUser) return null
            return(
                <div key={chat._id} className='chat-item' onClick={()=>setSelectedChat(chat)}>
                    <strong className='chat-avatar'>{otherUser.username.charAt(0).toUpperCase()}</strong>
                    <div className="chat-info">
                        <div className="chat-name">
                            {otherUser.username}
                        </div>
                        <div className="chat-last">
                            {chat.latestMessage?.content || "No message yet"}
                        </div>
                    </div>
                </div>
            )
        })
    }
    <br />
    <button onClick={openNewChat} className='new-btn'>New Chat</button>

    {showNewChat && (
        <NewChat
          close={closeNewChat}
          addChat={(chat) => {
            setChats((prev) => {
                const exists = prev.find((c)=>c._id === chat._id)
                if(exists) return prev;
                return [chat , ...prev]
            });
            closeNewChat();
          }}
        />
      )}
    
   </div>
   </>
  )
}
