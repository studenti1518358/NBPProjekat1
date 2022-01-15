import "./Topbar.css"
import React,{useState,useEffect,useMemo,useContext,useRef} from 'react'
import {NavLink, useNavigate} from "react-router-dom"
import Search from './Search'
import {Context} from '../context/Store'

import Notifikacije from './Notifikacije'
export default function Topbar(props) {
  const [state,dispatch]=useContext(Context);
  const [showNotifications,setShowNotifications]=useState(false)
  const navigate=useNavigate()

  const handleHistory1=()=>
  {
    navigate("/Profil")
  }

  
  
  /*const podaci=[
    {
      ime:'Andrea',
      prezime:'Popovic',
      slika:'/slike/prof1.jpg'
    },
    {
      ime:'Milos',
      prezime:'Popovic',
      slika:'/slike/profil.jpg'
    },
    {
      ime:'Marko',
      prezime:'Markovic',
      slika:'/slike/prof2.jpg'
    },
    {
      ime:'Nikola',
      prezime:'Pesic',
      slika:'/slike/profil.jpg'
    },
    {
      ime:'Mihajlo',
      prezime:'Popovic',
      slika:'/slike/prof3.jpg'
    },
    {
      ime:'Ana',
      prezime:'Markovic',
      slika:'/slike/prof1.jpg'
    }
  ]*/
   const [podaci,setPodaci]= useState([])
   const [profilnaSrc,setProfilnaSrc]=useState(localStorage.getItem("profilna"))
   const [prikaziDiv,setPrikaziDiv]=useState(false)
   const [pretraga,setPretraga]=useState([])
   const [pretrazi,setPretrazi] =useState("")
  
  
   useEffect(() => {
     setProfilnaSrc(localStorage.getItem("profilna"))
    
     fetch("http://localhost:5000/api/User/allUsers").then(pod=>{
       if(pod.status===200){
               pod.json().then(obv=>{
                
                 
                  setPodaci(obv)
               

                })
              }
           })
          
  },[])
  useEffect(()=>{
    setProfilnaSrc(localStorage.getItem("profilna"))
  },[state])
const [isLogged,setIsLogged]=useState(true)

 const  pretrazii=(e)=>
 {
   
   setPrikaziDiv(true)
   setPretrazi(e)
   
   let obv=podaci
   if(e==="")
   {
    setPrikaziDiv(false)
    setPretrazi(e)
   }
   if(pretrazi)
  {
      obv=obv.filter(
          obav=>
          obav.ime.toLowerCase().includes(pretrazi.toLowerCase()) ||
          obav.prezime.toLowerCase().includes(pretrazi.toLowerCase())
      )
  }
 
  setPretraga(obv)

 }


  return (
    <div className="topbarContainerGlavni">
    <div className="topbarContainer"> 
      <div className="topbarCenter">
       
          <input
            placeholder="Pretraži "
            className="searchInput"
            onChange={e=>pretrazii(e.target.value)}
          />
         
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
        
        </div>
        <div className="topbarIcons">
        <div className="topbarIconItem">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle ikonicaBar" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
        </svg>
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
          
         <Notifikacije novaNotifikacija={props.novaNotifikacija} />
        
          </div>
          <div className="topbarIconItem">
            <NavLink to="/Chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-dots-fill ikonicaBar" viewBox="0 0 16 16">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
         </svg>
          
            </NavLink>
          </div>
        
        </div>
       {isLogged && <img  src={profilnaSrc} alt="" className="topbarImg" onClick={handleHistory1}/>}
      </div>
    </div>
    {prikaziDiv?<div className='divTopBarPretrazi'>
    {pretraga.map((obv,i)=>{
        const changeFriend=()=>{
          dispatch({type:'SET_FRIEND',payload:obv.username});
          dispatch({type:'SET_FRIEND_SRC',payload:obv.profilnaSrc});
          dispatch({type:'SET_FRIEND_ONLINE',payload:obv.isOnline});
          dispatch({type:'SET_FRIEND_LAST_SEEN',payload:obv.lastSeen});
          setPrikaziDiv(false)
          navigate('/Chat')

        }
          return ( <div className= 'divPratilacGlavnii'>
                <div className='divPratilacPretraga'>
                  <NavLink to={'/profil/'+obv.username}>
               <img alt="" src={obv.profilnaSrc} className='imgPratilacc' key={i}/>
               </NavLink>
               <label  className='lblPratilac' key={i+999999}>{obv.ime} {obv.prezime}</label>
               </div>
               <svg onClick={changeFriend} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-dots-fill ikonicaBar" viewBox="0 0 16 16">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
         </svg>
            </div>
         )})}

    </div>:null}
    </div>
  )
}