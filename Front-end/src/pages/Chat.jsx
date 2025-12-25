import React, { useState } from 'react'
import ChatList from '../components/ChatList'
import ChatBox from '../components/ChatBox'

export default function Chat() {
  const[selectedChat , setSelectedChat]=  useState(null)
  return (
    <>
      <div className='main'>
        <div className='left'>
            <ChatList setSelectedChat={setSelectedChat}/>
        </div>
        <div className='right'>
          {selectedChat ? (
            <ChatBox chat={selectedChat}/>
          ) : (
            <p>Select a Chat</p>
          )
          }
        </div>
      </div>
    </>
  )
}
