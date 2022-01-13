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
  const handleHistory2=()=>
  {
    navigate("/Informacije")
  }
  const handleHistory3=()=>
  {
    navigate("/Pratioci")
  }
  const handleHistory4=()=>
  {
    navigate("/Prati")
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
  const [mojeObjave,setMojeObjave]=useState([])
  const [ime,setIme]= useState("")
  const [prezime,setPrezime]= useState("")
  const [opis,setOpis]=useState("")
  //const [prikazDodajOpis,setPrikazDodajOpis]=useState(false)
  const [prikazFormeDodajOpis,setPrikazFormeDodajOpis]=useState(false)
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
                
               })
               fetch("http://localhost:5000/api/User/getUser/"+localStorage.getItem("username"), {
                headers:{'Content-Type':'application/json'},
                credentials:'include'}).then(korisnik=>{
                  if(korisnik.status===200){
                 korisnik.json().then(podaci=>{
                   console.log(podaci)
                  setIme(podaci.user.ime)
                  setPrezime(podaci.user.prezime)
                  setOpis(podaci.user.opis)
                 
                  
                 })
                }
          })
        })
		   const getObjave=async()=>{ const objaveRes=await fetch("http://localhost:5000/api/Objave/getObjave/"+localStorage.getItem("username"))
          console.log(objaveRes)
          const objave=await objaveRes.json()
       
              setMojeObjave(objave)
          console.log(objave)
        }
          getObjave();
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
   const SacuvajOpis=()=>{
     console.log(opis)
     setPrikazFormeDodajOpis(false)
     fetch("http://localhost:5000/api/User/dodajOpis/"+localStorage.getItem("username"),{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(
              {
                opis:opis
              }
            )
            }).then(p=>{
               
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
                <h4 className="profileInfoName">{ime} {prezime}</h4>
                <span className="profileInfoDesc">{opis}</span>
                <div className='divDugmiciIzmeniSlike'>
                {prikazDugmetaIzmeniSliku? <button className='btn btn-info btnIzmeniSliku' 
          onClick={()=>{setPrikazFormeZaIzborSlike(true) ;setPrikazDugmetaIzmeniSliku(false)}}>Izmeni profilnu sliku</button>:null}
                  {prikazDugmetaIzmeniSlikuNaslovna? <button className='btn btn-info btnIzmeniSliku' 
          onClick={()=>{setPrikazFormeZaIzborSlikeNaslovna(true) ;setPrikazDugmetaIzmeniSlikuNaslovna(false)}}>Izmeni naslovnu sliku</button>:null}
               <button className='btn btn-info btnIzmeniSliku' onClick={()=>setPrikazFormeDodajOpis(true)}>Dodaj opis</button>
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
           {prikazFormeZaIzborSlikeNaslovna? 
           <input type='file'
         placeholder='Izaberi sliku'
         id='profilnaSlika'
          className='form-control-file chooseFile' onChange={izmeniNaslovnuSliku}/>:null}

           {prikazFormeDodajOpis? 
           <div className='divDodajOpis'> 
           <input type='text'
            placeholder='Dodaj opis'
            onChange={e=>setOpis(e.target.value)}
           className='form-control-file chooseFile' />
           <button  className='btn btn-info btnDodajOpis' onClick={()=>SacuvajOpis()}> Sacuvaj</button>
           </div>:null}
          
         {prikazFormeZaIzborSlikeNaslovna?<button className='btn btn-info btnIzmeniSliku'
          onClick={()=> izmeniTrajnoNaslovnuSliku()}>Sacuvaj izmenu</button>:null}
          
            </div>
          </div>
          
          <div className="profileRightBottom">
           <Share/>
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