import {
    Sidebar,
    
    
  } from "@chatscope/chat-ui-kit-react";
  import {Search} from 'semantic-ui-react'
  import {useEffect,useContext,useState} from 'react'
  import {Context} from '../../context/Store'
  import alt from "../../altAvatar.png"

  export default function ChatSidebar(){
    const [pretraga,setPretraga]=useState([])
    const [pretrazi,setPretrazi] =useState("")
    const [podaci,setPodaci]= useState([])
    const [prikaziDiv,setPrikaziDiv]=useState(false)
    const[value,setValue]=useState('')
    const[state,dispatch]=useContext(Context)
    useEffect(() => {
       
       
        fetch("http://localhost:5000/api/User/all Users").then(pod=>{
                  pod.json().then(obv=>{
                   
                    
                     setPodaci(obv)
                  
   
                   })
              })
      
     },[])

     const resultRenderer=(user)=>{
        const changeFriend=()=>{
            dispatch({type:'SET_FRIEND',payload:user.username});
            dispatch({type:'SET_FRIEND_SRC',payload:user.profilnaSrc});
           
  
          }
         return (<div style={{width:'100% !important'}} onClick={changeFriend}><img style={{height:'40px',width:'40px',borderRadius:'20px',marginRight:'10px'}} alt='' src={user.profilnaSrc?user.profilnaSrc:alt} /><label>{user.ime} {user.prezime}</label></div>)
     }

     const  pretrazii=(e)=>
 {
   console.log(e)
   console.log(e.target.value)
   setPrikaziDiv(true)
   setPretrazi(e)
   console.log(podaci)
  
   setValue(e)
   console.log(value)
   let obv=podaci
   if(e.target.value==="")
   {
    setPrikaziDiv(false)
    setPretrazi(e)
   }
   if(pretrazi)
  {
      console.log(e)
      obv=obv.filter(
          obav=>
          obav.ime.toLowerCase().includes(e.target.value) ||
          obav.prezime.toLowerCase().includes(e.target.value)
      )
  }
 
  setPretraga(obv)
  console.log(obv)
  //setPrikaziDiv(true)

 }



    return (

        <Sidebar position='right' >
              <Search  placeholder="Search..." style={{ padding: "10px",width:'50', height: "50px" }} 
                onSearchChange={e=>pretrazii(e)} resultRenderer={resultRenderer} results={pretraga}/>
              
          
        </Sidebar>

    )
  }