import React, { useState } from 'react'
import ChatList from '../components/ChatList'
import ChatBox from '../components/ChatBox'

export default function Chat() {
  const[selectedChat , setSelectedChat]=  useState(null)
  const[showNewChat , setShowNewChat] = useState(false)
  const[activeView , setActiveView] = useState("list")
  const isMobile = window.innerWidth < 768;

  const openChat = (chat) =>{
    setSelectedChat(chat)
    setShowNewChat(false)
    if(isMobile) setActiveView("chat")
  }

  const goBack = () =>{
    setSelectedChat(null)
    setActiveView("list")
  }
  return (
    <>
      <div className='main'>
        <div className='left'>
          {(!isMobile || activeView === "list") && (
            <ChatList setSelectedChat={openChat}
            openNewChat = {()=>{
              setSelectedChat(null)
              setShowNewChat(true)
              if(isMobile) setActiveView("list")
            }}
            showNewChat={showNewChat}
            closeNewChat = {()=>setShowNewChat(false)}
            />
          )}
        </div>
        {(!isMobile || activeView === "chat") && (
          <div className='right'>
          {selectedChat ? (
            <ChatBox chat={selectedChat} goBack={goBack}/>
          ): (
            !isMobile && <div className="empty-chat">Select A Chat</div>
          )}
        </div>
        )}
      </div>
    </>
  )
}
