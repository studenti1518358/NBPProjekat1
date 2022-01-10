import "./Topbar.css"
import React,{useState,useEffect,useMemo} from 'react'
import {NavLink, useNavigate} from "react-router-dom"
import Search from './Search'
export default function Topbar() {
  const navigate=useNavigate()

  const handleHistory1=()=>
  {
    navigate("/Profil")
  }
  const podaci=[
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
  ]
   const [profilnaSrc,setProfilnaSrc]=useState('/slike/profil.jpg')
   const [prikaziDiv,setPrikaziDiv]=useState(false)
   const [pretraga,setPretraga]=useState([])
   const [trStranica,setTrStranica]=useState(1)
   const [ukupnoStavki,setUkupnoStavki]=useState(0)
   const [pretrazi,setPretrazi] =useState("")
   const STAVKE_PO_STRANICI=5
   useEffect(() => {
     setProfilnaSrc(localStorage.getItem("profilna"))
    
  },[])
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell ikonicaBar" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
         </svg>
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <NavLink to="/Chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-dots-fill ikonicaBar" viewBox="0 0 16 16">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
         </svg>
            <span className="topbarIconBadge">2</span>
            </NavLink>
          </div>
        
        </div>
       {isLogged && <img  src={profilnaSrc} alt="" className="topbarImg" onClick={handleHistory1}/>}
      </div>
    </div>
    {prikaziDiv?<div className='divTopBarPretrazi'>
    {pretraga.map((obv,i)=>(
            <div className= 'divPratilacGlavnii'>
                <div className='divPratilacPretraga'>
               <img alt="" src={obv.slika} className='imgPratilacc' key={i}/>
               <label  className='lblPratilac' key={i+999999}>{obv.ime} {obv.prezime}</label>
               </div>
              
            </div>
         ))}

    </div>:null}
    </div>
  )
}