import React,{useState} from "react"

import {ChatContainer,ConversationHeader,Avatar,InfoButton,MessageList,Message,MessageSeparator,MessageInput} from  "@chatscope/chat-ui-kit-react";
import zoe from "../zoe.svg"

export function Convo({me,friend,messages,addNewMessage}){

    const [myMessage,setMyMessage]=useState("")

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
            date:1111
        }
      addNewMessage(novaPoruka)
      setMyMessage("")
    }

   return  <ChatContainer>
      <ConversationHeader>
                    <ConversationHeader.Back />
                    <Avatar src={zoe} name={friend} />
                    <ConversationHeader.Content userName={friend} info="Active 10 mins ago" />
                    <ConversationHeader.Actions>
                    
                      <InfoButton />
                    </ConversationHeader.Actions>          
                  </ConversationHeader>
        <MessageList>
        {messages.map((message,index)=>{
            const direction=message.usernameFrom===me?"outgoing":"incoming"
            return <Message key={index} model={{message:message.message,sentTime:message.date,sender:friend,direction:direction,position:"single"}} avatarSpacer>

            </Message>
        })}
      
                  
        </MessageList>
        <MessageInput value={myMessage} onChange={provera} placeholder="Type message here" onSend={sendMessage} />
      </ChatContainer>
    

}