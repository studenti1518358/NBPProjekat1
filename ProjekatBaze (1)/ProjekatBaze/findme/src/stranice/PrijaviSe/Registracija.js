import React,{useState} from 'react'
import { Routes, Route,Navigate } from 'react-router-dom'
import RegistrujSe from './RegistrujSe'
import FormularPrva from '../../stranice/Formular/FormPrva'
import FormularDruga from '../../stranice/Formular/FormDruga'
import FormularTreca from '../../stranice/Formular/FormTreca'


export default function Registracija({match}){
    const username=useState("")
    const email=useState("")
    const password=useState("")
    const ime=useState("")
    const prezime=useState("")
    const godine=useState(0)
    const pol=useState("Muski")
    const mestoStanovanja=useState("")
    const zanimanje=useState("")
    const bracniStatus=useState("Slobodan")
    const trazimKodPartnera=useState("")
    const visina=useState(0)
    const tezina=useState(0)
    const bojaKose=useState("Plava")
    const bojaOciju=useState("Plave")
    const omiljenaKnjiga=useState("")
    const omiljeniFilm=useState("")
    const zanrMuzike=useState("")
    const hobi=useState("")
    const visinaP=useState(0)
    const tezinaP=useState(0)
    const bojaKoseP=useState("Plava")
    const bojaOcijuP=useState("Plave")
    const godineOd=useState(0)
    const godineDo=useState(0)
    const polP=useState("Muski")
   
   
   const registracija1=async ()=>{
     console.log(ime[0])
     console.log(prezime[0])
     console.log(hobi[0])
    const response=await fetch('http://localhost:5000/api/Auth/registerUser',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
  osnovneInformacije: {
    username: username[0],
    password: password[0],
    email: email[0],
    ime: ime[0],
    prezime:prezime[0],
    godine: godine[0],
    pol:pol[0],
    mestoStanovanja:mestoStanovanja[0],
    bracniStatus: bracniStatus[0],
    zanimanje: zanimanje[0]
  },
  mojIzgled: {
    visina: visina[0],
    tezina: tezina[0],
    bojaKose:bojaKose[0],
    bojaOciju: bojaOciju[0]
  },
  izgledPartnera: {
    visina: visinaP[0],
    tezina: tezinaP[0],
    bojaKose:bojaKoseP[0],
    bojaOciju: bojaOcijuP[0]
  },
  interesovanja: {
    omiljenaKnjiga:omiljenaKnjiga[0],
    omiljeniFilm: omiljeniFilm[0],
    zanrMuzike: zanrMuzike[0],
    hobi: hobi[0]
  },
  trazimKodPartnera: {
    tipVeze:trazimKodPartnera[0],
    pol:polP[0],
    godineOd: godineOd[0],
    godineDo: godineDo[0]
  }
}
  
        )
       
      })
      console.log(response)
      console.log("cao")
      //console.log(await response.json())
      console.log(godineOd[0])
      console.log(godine[0])
      if(response.status===200)
      {
        return true
      }
      else
      {
        return false
      }
   }
   
    

    return(
   
        <Routes>
        <Route path='/registrujSe' element={<RegistrujSe username={username} email={email} password={password}/>}  />
        <Route path='/formPrva' element={<FormularPrva ime={ime} prezime={prezime} godine={godine} pol={pol} mestoStanovanja={mestoStanovanja} zanimanje={zanimanje} bracniStatus={bracniStatus} trazimKodPartnera={trazimKodPartnera}/>}/>
        <Route path='/formDruga' element={<FormularDruga visina={visina} tezina={tezina} bojaKose={bojaKose} bojaOciju={bojaOciju} omiljenaKnjiga={omiljenaKnjiga} omiljeniFilm={omiljeniFilm} zanrMuzike={zanrMuzike} hobi={hobi}/>}/>
        <Route path='/formTreca' element={<FormularTreca visina={visinaP} tezina={tezinaP} bojaKose={bojaKoseP} bojaOciju={bojaOcijuP} godineOd={godineOd} godineDo={godineDo} pol={polP}  registracija={registracija1}/>}/>
        </ Routes>
  
    )
}