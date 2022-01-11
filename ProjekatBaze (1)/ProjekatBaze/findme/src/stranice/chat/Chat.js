import React,{useState, useEffect} from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  
} from "@chatscope/chat-ui-kit-react";

import {ChatsList} from "./ChatsList"
import { Convo } from "./Convo";
import { HubConnectionBuilder } from '@microsoft/signalr';
export function Chat({newConnection}){

  const [messages,setMessages]=useState([])
  const [convoList,setConvoList]=useState([])
  const [friend,setFriend]=useState("")
  const [friendSrc,setFriendSrc]=useState("")
  const [first,setFirst]=useState(true)
  
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
      const response=await fetch('http://localhost:5000/api/My/getConversation?user1='+localStorage.getItem('username')+'&user2='+friend);
      const poruke=await response.json()
      setMessages(poruke.reverse())
  }
  const pokupiConvoList=async()=>{
    const response=await fetch('http://localhost:5000/api/My/getLatestMessages?user='+localStorage.getItem("username"));
    const poruke=await response.json()
    console.log(poruke)
    setConvoList(poruke.sort(compareMessages))
    console.log(poruke)
    if(first){
    setFriend(poruke[0].usernameTo===localStorage.getItem('username')?poruke[0].usernameFrom:poruke[0].usernameTo)
    console.log(friend)
    setFriendSrc(poruke[0].slikaSrc)
    setFirst(false)
    }
  }
  pokupiPoruke()
  pokupiConvoList()
    console.log(newConnection)
    if(newConnection){
      console.log('povezano')
   
      newConnection.on('ReceiveMessage',message=>{
             console.log(message)
               if(message.usernameFrom===friend)
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
          },[newConnection,friend])
  const addNewMessage=async (message)=>{
    setMessages(prevState=>[...prevState,message])
    const newConvoList=[...convoList]
    console.log(convoList)
    newConvoList.forEach((mess,index)=>{
      if(mess.usernameFrom===message.usernameTo || mess.usernameTo===message.usernameTo)
      {
            const slikaSrc=mess.slikaSrc
            newConvoList[index]=message
            newConvoList[index].slikaSrc=slikaSrc
      }
    

    })
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
    <ChatsList me={localStorage.getItem("username")} poruke={convoList} setFriend={setFriend} setFriendSrc={setFriendSrc}/>
    <Convo friendSrc={friendSrc} me={localStorage.getItem("username")} friend={friend} messages={messages} addNewMessage={addNewMessage}/>
    </MainContainer>
  </div>;
}