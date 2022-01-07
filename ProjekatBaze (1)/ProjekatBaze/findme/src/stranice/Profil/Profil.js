import "./Profil.css"
import Share from "../../components/Share"
import Post from '../../components/Post'
import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate} from "react-router-dom"
export default function Profile() {
  const navigate=useNavigate()
  const handleHistory1=()=>
  {
    navigate("/Fotografije")
  }
  const [prikazFormeZaIzborSlike,setPrikazFormeZaIzborSlike]=useState(false)
  const [prikazFormeZaIzborSlikeNaslovna,setPrikazFormeZaIzborSlikeNaslovna]=useState(false)
  const [prikazDugmetaIzmeniSliku,setPrikazDugmetaIzmeniSliku]=useState(true)
  const [prikazDugmetaIzmeniSlikuNaslovna,setPrikazDugmetaIzmeniSlikuNaslovna]=useState(true)
  const [profilnaIme,setProfilnaIme]=useState("")
  const [profilnaSrc,setProfilnaSrc]=useState('/slike/profil.jpg')
  const [profilnaFile,setProfilnaFile]=useState(null)
  const [naslovnaIme,setNaslovnaIme]=useState("")
  const [naslovnaSrc,setNaslovnaSrc]=useState('/slike/profil.jpg')
  const [naslovnaFile,setNaslovnaFile]=useState(null)
  const [korisnickoIme,setKorisnickoIme]=useState("")
  useEffect(() => {
     
    
           
            fetch("http://localhost:5000/api/Auth/getUser", {
              headers:{'Content-Type':'application/json'},
              credentials:'include'
            }).then(korisnik=>{
    
               korisnik.json().then(podaci=>{
                setKorisnickoIme(podaci.username)
                if(podaci.profilnaSrc!=null)
                   {
                    setProfilnaSrc(podaci.profilnaSrc)
                   }
                  
                   if(podaci.naslovnaSrc!=null)
                   {
                    setNaslovnaSrc(podaci.naslovnaSrc)
                   }
                 
                  
                   localStorage.setItem("profilna",podaci.profilnaSrc)
                   localStorage.setItem("username",podaci.username)
                   console.log(podaci)                   
               })
          })
  },[])
  const izmeniSliku=(e)=>{
    if(e.target.files && e.target.files[0])
    {
      let imgFile=e.target.files[0]
      const reader= new FileReader()
      reader.onload=x=>{
        
        setProfilnaSrc(x.target.result)
      }
      reader.readAsDataURL(imgFile)
      setProfilnaFile(imgFile)
      setProfilnaIme(imgFile.name)
    }
  }
  const izmeniTrajnoSliku=()=>{
    const formData=new FormData()
    formData.append("profilnaFile",profilnaFile)
    console.log("Profilna"+profilnaFile)
       axios.put("http://localhost:5000/api/Objave/IzmeniSliku/"+korisnickoIme,formData).then(p=>{  
         console.log(p)
        if(p!=null)
        {
         
         setPrikazDugmetaIzmeniSliku(true)
         setPrikazFormeZaIzborSlike(false) 
        }
      })
        

   }
  const izmeniNaslovnuSliku=(e)=>{
    if(e.target.files && e.target.files[0])
    {
      let imgFile=e.target.files[0]
      const reader= new FileReader()
      reader.onload=x=>{
        
        setNaslovnaSrc(x.target.result)
      }
      reader.readAsDataURL(imgFile)
      setNaslovnaFile(imgFile)
      setNaslovnaIme(imgFile.name)
    }
  }
  const izmeniTrajnoNaslovnuSliku=()=>{
    const formData=new FormData()
    formData.append("naslovnaFile",naslovnaFile)
       axios.put("http://localhost:5000/api/Objave/IzmeniNaslovnuSliku/"+korisnickoIme,formData).then(p=>{  
         console.log(p)
        if(p!=null)
        {
         
         setPrikazDugmetaIzmeniSlikuNaslovna(true)
         setPrikazFormeZaIzborSlikeNaslovna(false) 
        }
      })
        

   }

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
                <h4 className="profileInfoName">Ana Milenkovic</h4>
                <span className="profileInfoDesc">Zdravo svima!</span>
                <div className='divDugmiciIzmeniSlike'>
                {prikazDugmetaIzmeniSliku? <button className='btn btn-info btnIzmeniSliku' 
          onClick={()=>{setPrikazFormeZaIzborSlike(true) ;setPrikazDugmetaIzmeniSliku(false)}}>Izmeni profilnu sliku</button>:null}
                  {prikazDugmetaIzmeniSlikuNaslovna? <button className='btn btn-info btnIzmeniSliku' 
          onClick={()=>{setPrikazFormeZaIzborSlikeNaslovna(true) ;setPrikazDugmetaIzmeniSlikuNaslovna(false)}}>Izmeni naslovnu sliku</button>:null}
               </div>
                {prikazFormeZaIzborSlike? 
           <input type='file'
         placeholder='Izaberi sliku'
         id='profilnaSlika'
          className='form-control-file chooseFile' onChange={izmeniSliku}/>:null}
           {prikazFormeZaIzborSlike?<button className='btn btn-info btnIzmeniSliku'
          onClick={()=> izmeniTrajnoSliku()}>Sacuvaj izmenu</button>:null}
           {prikazFormeZaIzborSlikeNaslovna? 
           <input type='file'
         placeholder='Izaberi sliku'
         id='profilnaSlika'
          className='form-control-file chooseFile' onChange={izmeniNaslovnuSliku}/>:null}
         {prikazFormeZaIzborSlikeNaslovna?<button className='btn btn-info btnIzmeniSliku'
          onClick={()=> izmeniTrajnoNaslovnuSliku()}>Sacuvaj izmenu</button>:null}
            </div>
          </div>
          <div className="profileRightBottom">
           <Share/>
           <button className="btnProfil" onClick={handleHistory1}>
             Fotografije korisnika
           </button>
           <Post/>
          </div>
        </div>
      </div>
    </>
  )
}