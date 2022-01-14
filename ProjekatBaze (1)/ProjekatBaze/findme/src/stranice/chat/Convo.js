import moment from 'moment'
import React,{useState} from "react"
import ChatMessage from './ChatMessage'
import {ChatContainer,ConversationHeader,Avatar,InfoButton,MessageList,Message,MessageSeparator,Status,MessageInput} from  "@chatscope/chat-ui-kit-react";
import alt from "../../altAvatar.png"

export function Convo({me,friend,messages,addNewMessage,friendSrc,friendOnline,friendLastSeen}){

    const [myMessage,setMyMessage]=useState("")
    console.log(friendOnline)
    console.log(friendLastSeen)
    const status=friendOnline?'available':(friendLastSeen?'away':'unavailable')
    const lastSeen=friendOnline?'Active Now':(status==='away'?'Last seen: '+moment(Date.parse(friendLastSeen)).fromNow():'Offline')
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
            date:(new Date().valueOf()).toString(),
            isFriendOnline:friendOnline,
            friendLastSeen:friendLastSeen
            
        }
      addNewMessage(novaPoruka)
      setMyMessage("")
    }

   return  <ChatContainer>
      <ConversationHeader>
                    <ConversationHeader.Back />
                    <Avatar src={slikaSrc}  name={friend} status={status} />
                    <Status status={status} />
                    <ConversationHeader.Content userName={friend} info={lastSeen} status={status} />
                    <ConversationHeader.Actions>
                    
                      <InfoButton />
                    </ConversationHeader.Actions>          
                  </ConversationHeader>
        <MessageList>
        {messages.map((message,index)=>{
          
            const direction=message.usernameFrom===me?"outgoing":"incoming"
            return <ChatMessage key={index} message={message} friend={friend} me={me} avatarSpacer>
          
            </ChatMessage>
        })}
      
                  
        </MessageList>
        <MessageInput value={myMessage} onChange={provera} placeholder="Type message here" onSend={sendMessage} />
      </ChatContainer>
    

}