import './App.css'
import {useState,useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar'
import Topbar from './components/Topbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Pocetna from './stranice/Pocetna/Pocetna'
import PrijaviSe from './stranice/PrijaviSe/PrijaviSe'
import { HubConnectionBuilder } from '@microsoft/signalr';
import UspesnoRegistrovanje from './stranice/PrijaviSe/UspesnoRegistrovanje'
import Profil from './stranice/Profil/Profil'
import Novosti from './stranice/Novosti/Novosti'
import Predlozi from './stranice/Predlozi/Predlozi'
import {Chat} from "./stranice/chat/Chat"
import Registracija from './stranice/PrijaviSe/Registracija'
import Store from './context/Store'
import Fotografije from './stranice/Fotografije/Fotografije'
import Informacije from './stranice/Informacije/Informacije'
import Pratioci from './stranice/Pratioci/Pratioci'
import Prati from './stranice/Prati/Prati'
import { ToastProvider, useToasts } from 'react-toast-notifications';
function App() {
  const [username,setUsername]=useState("")
  const [myConnection,setMyConnection]=useState(null)
  const [notification,setNotifikacija]=useState({})
  const [friend,setFriend]=useState("")
  const { addToast } = useToasts()
  let connection=null
  useEffect(()=>{
    const connect=()=>{const newConnection=new HubConnectionBuilder()
        
       
    .withUrl('http://localhost:5000/hubs/chat?username='+localStorage.getItem('username')
        
    )
    .withAutomaticReconnect()
    .build();
    newConnection.start()
    .then(result=>{
        console.log('connect');
        newConnection.invoke("GetConnectionId").then(rez=>{console.log(rez)})
        newConnection.on("ReceiveMessage",message=>{
          addToast("Korisnik: "+message.usernameFrom+" vam je posalo/la poruku",{
            appearance:'info',
            autoDismiss:true
          })
        })
        newConnection.on('ReceiveNotification',notifikacija=>{
           
          //setMessages(prevState=>[...prevState,message])
          console.log("stigla notifikacija")
          setNotifikacija(notifikacija)
            addToast(notifikacija.text,{
              appearance:'info',
              autoDismiss:true
            })

        });
    })
    .catch(e=>console.log('ne valja',e));
    setMyConnection(newConnection)
  connection=newConnection
console.log(connection)
  console.log(newConnection)}

    connect()
    

      
  },[username])
  return (
   <div>
  
   <>
 
   <Store>
      <Router>
        <Navbar />
        <Topbar/>
        <Routes>
        <Route path='/' element={<Pocetna/>}/>
        <Route path='/prijaviSe' element={<PrijaviSe setUsernam={setUsername}/>}/>
        <Route path='/registracija/*' element={<Registracija/>}/>
        <Route path='/Fotografije' element={<Fotografije/>}/>
         <Route path='/Informacije' element={<Informacije/>}/>
        <Route path='/Pratioci' element={<Pratioci/>}/>
        <Route path='/Prati' element={<Prati/>}/>
        <Route path='/UspesnoRegistrovanje' element={<UspesnoRegistrovanje/>}/>
        <Route path='/Profil' element={<Profil/>}/>
        <Route path='/PocetnaStrana' element={<Novosti/>}/>
        <Route path='/Predlozi/*' element={<Predlozi/>}/>
        <Route path='/Chat'  element={<Chat newConnection={myConnection}/>}/>
        </Routes>
      
      </Router>
      </Store>
    
    </>
   </div> 
  )
}

export default App
