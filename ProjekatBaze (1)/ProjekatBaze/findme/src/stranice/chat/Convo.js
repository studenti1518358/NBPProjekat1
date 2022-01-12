import React,{useState} from "react"

import {ChatContainer,ConversationHeader,Avatar,InfoButton,MessageList,Message,MessageSeparator,MessageInput} from  "@chatscope/chat-ui-kit-react";
import alt from "../../altAvatar.png"

export function Convo({me,friend,messages,addNewMessage,friendSrc}){

    const [myMessage,setMyMessage]=useState("")
    const slikaSrc=friendSrc?friendSrc:alt
    const provera=(event)=>{
        setMyMessage(event)
       // console.log(myMessage)
    }
    const sendMessage=()=>{
        console.log(messages)
        const novaPoruka={
            message:myMessage,
            usernameFrom:me,
            usernameTo:friend,
            date:(new Date().valueOf()).toString()
        }
      addNewMessage(novaPoruka)
      setMyMessage("")
    }

   return  <ChatContainer>
      <ConversationHeader>
                    <ConversationHeader.Back />
                    <Avatar src={slikaSrc}  name={friend} />
                    <ConversationHeader.Content userName={friend} info="Active 10 mins ago" />
                    <ConversationHeader.Actions>
                    
                      <InfoButton />
                    </ConversationHeader.Actions>          
                  </ConversationHeader>
        <MessageList>
        {messages.map((message,index)=>{
            const direction=message.usernameFrom===me?"outgoing":"incoming"
            return <Message key={index} model={{message:message.message,sentTime:new Date(Number(message.date)).toLocaleString(),sender:friend,direction:direction,position:"single"}} avatarSpacer>

            </Message>
        })}
      
                  
        </MessageList>
        <MessageInput value={myMessage} onChange={provera} placeholder="Type message here" onSend={sendMessage} />
      </ChatContainer>
    

}