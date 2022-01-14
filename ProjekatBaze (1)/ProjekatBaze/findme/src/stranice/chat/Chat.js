import React,{useState, useEffect,useContext} from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  
} from "@chatscope/chat-ui-kit-react";

import {ChatsList} from "./ChatsList"
import { Convo } from "./Convo";
import {Context} from '../../context/Store'
import ChatSidebar from './ChatSidebar'
import { HubConnectionBuilder } from '@microsoft/signalr';
export function Chat({newConnection}){

  const [messages,setMessages]=useState([])
  const [convoList,setConvoList]=useState([])
  //const [friend,setFriend]=useState("")
  //const [friendSrc,setFriendSrc]=useState("")
  const [first,setFirst]=useState(true)
  const [state,dispatch]=useContext(Context);
  console.log(state.riendOnline)
  console.log(state.friendLastSeen)
  //const [myMessage,setMyMessage]=useState("")
  const compareMessages=(m1,m2)=>{
    if(Number(m1.date)>Number(m2.date))
      return -1;
    else if(Number(m1.date)<Number(m2.date))
      return 1;
    return 0;

  }
 
  useEffect(()=>{
    
    const pokupiPoruke=async()=>{
      const response=await fetch('http://localhost:5000/api/My/getConversation?user1='+localStorage.getItem('username')+'&user2='+state.friend);
      const poruke=await response.json()
      setMessages(poruke.reverse())
  }
  const pokupiConvoList=async()=>{
    const response=await fetch('http://localhost:5000/api/My/getLatestMessages?user='+localStorage.getItem("username"));
    const poruke=await response.json()
    console.log(poruke)
    setConvoList(poruke.sort(compareMessages))
    console.log(poruke)
    if(!state.friend){
    const newFriend=poruke[0].usernameTo===localStorage.getItem('username')?poruke[0].usernameFrom:poruke[0].usernameTo;
    dispatch({type:'SET_FRIEND',payload:newFriend});
    console.log(state.friend)
   // setFriendSrc(poruke[0].slikaSrc)
    dispatch({type:'SET_FRIEND_SRC',payload:poruke[0].slikaSrc});
    dispatch({type:'SET_FRIEND_ONLINE',payload:poruke[0].isFriendOnline});
    dispatch({type:'SET_FRIEND_LAST_SEEN',payload:poruke[0].friendLastSeen});
    setFirst(false)
    }
  }
  pokupiPoruke()
  pokupiConvoList()
    console.log(newConnection)
    if(newConnection){
      console.log('povezano')
   
      newConnection.on('ReceiveMessage',message=>{
              message.isFriendOnline=true
              dispatch({type:'SET_FRIEND_ONLINE',payload:true});
             console.log(message)
               if(message.usernameFrom===state.friend)
                  setMessages(prevState=>[...prevState,message])
              const newConvoList=[...convoList]
              let nova=true
              newConvoList.forEach((mess,index)=>{
                if(mess.usernameFrom===message.usernameFrom || mess.usernameTo===message.usernameFrom){
                  newConvoList[index]=message
                  nova=false
                }
              })
              if(nova)
                newConvoList.push(message)
              newConvoList.sort(compareMessages)
              setConvoList(newConvoList)

              console.log("stigla poruka")
                

            });}
        
      //  .catch(e=>console.log('ne valja',e));},[])
          },[newConnection,state.friend])
  const addNewMessage=async (message)=>{
    setMessages(prevState=>[...prevState,message])
    const newConvoList=[...convoList]
    console.log(convoList)
    let isNewFriend=true
    newConvoList.forEach((mess,index)=>{
      if(mess.usernameFrom===message.usernameTo || mess.usernameTo===message.usernameTo)
      {
            const slikaSrc=mess.slikaSrc
            newConvoList[index]=message
            newConvoList[index].slikaSrc=slikaSrc
            isNewFriend=false
      }
    

    })
    if(isNewFriend)
         newConvoList.push(message)
    console.log(newConvoList)
    newConvoList.sort(compareMessages)
    setConvoList(newConvoList)
      const response=await fetch('http://localhost:5000/api/My/sendMessage',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(message)
  })
    console.log(response)
    //console.log(await response.json())
    console.log(message)
}

    return <div style={{ position: "relative", height: "520px" }}>
    <MainContainer responsive>
    <ChatsList me={localStorage.getItem("username")} poruke={convoList} />
    <Convo friendSrc={state.friendSrc} me={localStorage.getItem("username")} friend={state.friend} messages={messages} addNewMessage={addNewMessage}
    friendOnline={state.friendOnline} friendLastSeen={state.friendLastSeen}/>
    <ChatSidebar />
    </MainContainer>
  </div>;
}