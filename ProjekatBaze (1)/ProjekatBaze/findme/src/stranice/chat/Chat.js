import React,{useState, useEffect} from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  
} from "@chatscope/chat-ui-kit-react";

import {ChatsList} from "./ChatsList"
import { Convo } from "./Convo";
import { HubConnectionBuilder } from '@microsoft/signalr';
export function Chat(props){

  const [messages,setMessages]=useState([])
  //const [myMessage,setMyMessage]=useState("")
  
  const pokupiPoruke=async()=>{
      const response=await fetch('http://localhost:5000/api/My/getConversation?user1=Marija&user2=Milica');
      const poruke=await response.json()
      setMessages(poruke.reverse())
  }
  useEffect(()=>{
    pokupiPoruke()
   
    const newConnection=new HubConnectionBuilder()
        
       
    .withUrl('http://localhost:5000/hubs/chat?username=Marija'
        
    )
    .withAutomaticReconnect()
    .build();
    

        newConnection.start()
        .then(result=>{
            console.log('connect');
            newConnection.invoke("GetConnectionId").then(rez=>{console.log(rez)})
        
            newConnection.on('ReceiveMessage',message=>{
               
              setMessages(prevState=>[...prevState,message])
              console.log("stigla poruka")
                

            });
        })
        .catch(e=>console.log('ne valja',e));},[])
  
  const addNewMessage=async (message)=>{
    setMessages(prevState=>[...prevState,message])

      const response=await fetch('http://localhost:5000/api/My/sendMessage',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(message)
  })
    console.log(response)
}

    return <div style={{ position: "relative", height: "520px" }}>
    <MainContainer responsive>
    <ChatsList me="Marija"/>
    <Convo me="Marija" friend="Milica" messages={messages} addNewMessage={addNewMessage}/>
    </MainContainer>
  </div>;
}