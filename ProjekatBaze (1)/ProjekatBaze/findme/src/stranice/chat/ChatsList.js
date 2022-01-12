import React,{useState, useEffect,useContext} from "react";
import {Sidebar,ConversationList,Avatar,Conversation,Search} from  "@chatscope/chat-ui-kit-react";
import zoe from "../zoe.svg"
import {Context} from '../../context/Store'
import alt from "../../altAvatar.png"

export function ChatsList(props){
    const [state,dispatch]=useContext(Context);
    //const [messages,setMessages]=useState([])
   console.log(props.me)
    return  <Sidebar position="left" scrollable={false}>
  
     <ConversationList>
         {props.poruke.map((message)=>{
             const slika=message.slikaSrc?message.slikaSrc:alt
             const myName=props.me;
             const name=message.usernameTo===props.me?message.usernameFrom:message.usernameTo
             console.log(name)
             const changeConvo=()=>{
                 //props.setFriend(name)
                 //props.setFriendSrc(message.slikaSrc)
                 dispatch({type:'SET_FRIEND',payload:name});
                 dispatch({type:'SET_FRIEND_SRC',payload:message.slikaSrc});
                 console.log(state)
             }
             const lastSenderName=message.usernameFrom===myName?"Me":message.usernameFrom
             return <Conversation onClick={changeConvo} key={name} name={name} info={message.message} lastSenderName={lastSenderName}>
                  <Avatar src={slika} name="Lilly" status="available" />
             </Conversation>
         })}
    
    </ConversationList>
    </Sidebar>
}