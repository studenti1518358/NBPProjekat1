import React,{useState, useEffect,useContext} from "react";
import {Sidebar,ConversationList,Avatar,Conversation,MessageSeparator} from  "@chatscope/chat-ui-kit-react";
import zoe from "../zoe.svg"
import {Context} from '../../context/Store'
import alt from "../../altAvatar.png"
import moment from 'moment'

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
             const status=message.isFriendOnline?'available':(message.friendLastSeen?'away':'unavailable')
             console.log(name)
             const changeConvo=()=>{
                 //props.setFriend(name)
                 //props.setFriendSrc(message.slikaSrc)
                 dispatch({type:'SET_FRIEND',payload:name});
                 dispatch({type:'SET_FRIEND_SRC',payload:message.slikaSrc});
                 dispatch({type:'SET_FRIEND_ONLINE',payload:message.isFriendOnline});
                 dispatch({type:'SET_FRIEND_LAST_SEEN',payload:message.friendLastSeen});
                
             }
             const today=moment().startOf('day')
             const date=moment((new Date(Number(message.date))).toLocaleString())
             const time=date>today?date.format('h:mm a'):date.fromNow()
             const lastSenderName=message.usernameFrom===myName?"Me":message.usernameFrom
             return <><Conversation onClick={changeConvo} key={name} name={name} info={message.message} lastSenderName={lastSenderName}
             lastActivityTime={time}>
                  <Avatar src={slika} name={name} status={status} />
             </Conversation>
             
             </>
         })}
    
    </ConversationList>
    </Sidebar>
}