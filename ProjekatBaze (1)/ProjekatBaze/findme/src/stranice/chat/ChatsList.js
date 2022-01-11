import React,{useState, useEffect} from "react";
import {Sidebar,ConversationList,Avatar,Conversation,Search} from  "@chatscope/chat-ui-kit-react";
import zoe from "../zoe.svg"

export function ChatsList(props){
    //const [messages,setMessages]=useState([])
   console.log(props.me)
    return  <Sidebar position="left" scrollable={false}>
    <Search placeholder="Search..." style={{ paddingTop: "30px", height: "50px" }} />
     <ConversationList>
         {props.poruke.map((message)=>{
             const myName=props.me;
             const name=message.usernameTo===props.me?message.usernameFrom:message.usernameTo
             console.log(name)
             const changeConvo=()=>{
                 props.setFriend(name)
                 props.setFriendSrc(message.slikaSrc)
             }
             const lastSenderName=message.usernameFrom===myName?"Me":message.usernameFrom
             return <Conversation onClick={changeConvo} key={name} name={name} info={message.message} lastSenderName={lastSenderName}>
                  <Avatar src={message.slikaSrc} name="Lilly" status="available" />
             </Conversation>
         })}
    
    </ConversationList>
    </Sidebar>
}