import React,{useState, useEffect} from "react";
import {Sidebar,ConversationList,Avatar,Conversation,Search} from  "@chatscope/chat-ui-kit-react";
import zoe from "../zoe.svg"

export function ChatsList(props){
    const [messages,setMessages]=useState([])
    const pokupiPoruke=async()=>{
        const response=await fetch('http://localhost:5000/api/My/getLatestMessages?user=Marija');
        const poruke=await response.json()
        setMessages(poruke)
    }
    useEffect(()=>pokupiPoruke(),[])
    return  <Sidebar position="left" scrollable={false}>
    <Search placeholder="Search..." style={{ paddingTop: "30px", height: "50px" }} />
     <ConversationList>
         {messages.map((message)=>{
             const myName=props.me;
             const name=message.userTo===props.me?message.usernameFrom:message.usernameTo
             const lastSenderName=message.usernameFrom===myName?"Me":message.usernameFrom
             return <Conversation key={name} name={name} info={message.message} lastSenderName={lastSenderName}>
                  <Avatar src={zoe} name="Lilly" status="available" />
             </Conversation>
         })}
    
    </ConversationList>
    </Sidebar>
}