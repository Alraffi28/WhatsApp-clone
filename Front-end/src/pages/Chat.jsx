import React, { useState } from 'react'
import ChatList from '../components/ChatList'
import ChatBox from '../components/ChatBox'
import Toggle from '../components/Toggle'

export default function Chat() {
  const[selectedChat , setSelectedChat]=  useState(null)
  const[showNewChat , setShowNewChat] = useState(false)
  return (
    <>
      <div className='main'>
        <div className='left'>
            <ChatList setSelectedChat={setSelectedChat}
            openNewChat = {()=>{
              setSelectedChat(null)
              setShowNewChat(true)
            }}
            showNewChat={showNewChat}
            closeNewChat = {()=>setShowNewChat(false)}
            />
        </div>
        <div className='right'>
          {!showNewChat && selectedChat && (
            <ChatBox chat={selectedChat}/>
          )}
          {!showNewChat && !selectedChat && (
            <div className="empty-chat">Select A Chat</div>
          )}
          
        </div>
      </div>
    </>
  )
}
