

import "./Profil.css"
import Share from "../../components/Share"
import Post from '../../components/Post'
import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,useParams} from "react-router-dom"

export default function TudjProfil() {
    const {username}=useParams()
  const navigate=useNavigate()
  const handleHistory1=()=>
  {
    navigate("/Fotografije/"+username)
  }
  const handleHistory2=()=>
  {
    navigate("/Informacije/"+username)
  }
  const handleHistory3=()=>
  {
    navigate("/Pratioci/"+username)
  }
  const handleHistory4=()=>
  {
    navigate("/Prati/"+username)
  }

  const [profilnaSrc,setProfilnaSrc]=useState('/slike/profil.jpg')
 
  const [naslovnaSrc,setNaslovnaSrc]=useState('/slike/profil.jpg')
 
  const [mojeObjave,setMojeObjave]=useState([])
  const [ime,setIme]= useState("")
  const [prezime,setPrezime]= useState("")
  const [opis,setOpis]=useState("")
  //const [prikazDodajOpis,setPrikazDodajOpis]=useState(false)
 
  useEffect(() => {
           
           
               fetch("http://localhost:5000/api/User/getUser/"+username, {
                headers:{'Content-Type':'application/json'},
                credentials:'include'}).then(korisnik=>{
                  if(korisnik.status===200){
                 korisnik.json().then(podaci=>{
                   console.log(podaci)
                  setIme(podaci.user.ime)
                  setPrezime(podaci.user.prezime)
                  setOpis(podaci.user.opis)
                  setProfilnaSrc(podaci.user.profilnaSrc)
                 
                  
                 })
                }})
         
		   const getObjave=async()=>{ const objaveRes=await fetch("http://localhost:5000/api/Objave/getObjave/"+username)
          console.log(objaveRes)
          const objave=await objaveRes.json()
       
              setMojeObjave(objave)
          console.log(objave)
        }
          getObjave();
  },[])
 
 
        


  
 
   
  return (
    <>
      
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={naslovnaSrc}
                alt=""
              />
              <img
                className="profileUserImg"
                src={profilnaSrc}
                alt=""
              />
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{ime} {prezime}</h4>
                <span className="profileInfoDesc">{opis}</span>
               
           

          
          
        
          
            </div>
          </div>
          
          <div className="profileRightBottom">
          
           <div className='divBtnsProfil'>
           <button className="btnProfil" onClick={handleHistory2}>
             Informacije
           </button>
           <button className="btnProfil" onClick={handleHistory1}>
             Fotografije
           </button>
           <button className="btnProfil" onClick={handleHistory3}>
             Pratioci
           </button>
           <button className="btnProfil" onClick={handleHistory4}>
             Prati
           </button>
           </div>
          {
             mojeObjave.map((objava,index)=>{
               return (<Post key={index} post={objava}/>)
             })
           }
          </div>
        </div>
      </div>
    </>
  )
}