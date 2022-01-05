import React,{useState} from 'react'
import './FormPrva.css'
import { Navigate } from 'react-router-dom'

export default function FormDruga({visina,tezina,bojaKose,bojaOciju,godineOd,godineDo,pol,registracija}) {
   
  const  [redirect,setRedirect]=useState(false)
  const [uspesno,setUspesno]=useState(false)
   const submit=async()=>{
     console.log(registracija)
    const result= await registracija()
    if(result)
    {
       setUspesno(true)
       alert("Uspesno registrovanje!")

   }
   else{
     setUspesno(false)
     alert("Doslo je do greske,pokusajte ponovo!")
   }
   setRedirect(true)
  }
   if(redirect)
   {
     if(uspesno)
     return (<Navigate to="/UspesnoRegistrovanje"/>)
     else
     return (<Navigate to="/PrijaviSe"/>)

   }
    return (
        <div className='Formular'>
             <label className='lblFormular'>*Popunite informacija o osobi koja Vas zanima kako bi poboljšali predloge i uskladili ih sa Vašim zahtevima:</label>
            <div className='divFormularPrva'>
            <div className="form-group">
              <label htmlFor="username">Visina:</label>
              <input type="number" name="username" placeholder="Visina"  onChange={e=>visina[1](e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="username">Težina:</label>
              <input type="number" name="username" placeholder="Težina"  onChange={e=>tezina[1](e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="username">Boja kosa:</label>
             <select  onChange={e=>bojaKose[1](e.target.value)}>
               <option >Plava</option>
               <option >Crna</option>
               <option >Smedja</option>
               <option >Crvena</option>
               <option >Ridja</option>
               <option >Ništa od ponudjenog</option>
               <option>Svejedno</option>
             </select >
            </div>
            <div className="form-group">
              <label htmlFor="username">Boja očiju:</label>
             <select  onChange={e=>bojaOciju[1](e.target.value)} >
               <option >Plave</option>
               <option >Crne</option>
               <option >Zelene</option>
               <option >Braon</option>
               <option>Svejedno</option>
             </select>
            </div>
           
            <div className="form-group">
              <label htmlFor="username">Godine od:</label>
              <input type="number" name="username" placeholder="Godine"  onChange={e=>godineOd[1](e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="username">Godine do:</label>
              <input type="number" name="username" placeholder="Godine"  onChange={e=>godineDo[1](e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="username">Pol:</label>
             <select  onChange={e=>pol[1](e.target.value)} >
               <option >Muški</option>
               <option >Ženski</option>
             </select>
            </div>
            <button type="submit" onClick={submit}
                className='btnPocetna'
                 >
                Potvrdi
                </button>


            </div>
        </div>
    )
}
