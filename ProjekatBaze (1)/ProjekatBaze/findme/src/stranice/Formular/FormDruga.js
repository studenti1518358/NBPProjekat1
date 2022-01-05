import React from 'react'
import './FormPrva.css'
import {useNavigate} from "react-router-dom"
export default function FormDruga({visina,tezina,bojaKose,bojaOciju,omiljenaKnjiga,omiljeniFilm,zanrMuzike,hobi}) {
    const navigate=useNavigate()
   const handleHistory1=()=>
  {
    navigate("/registracija/formTreca")
  }
  
    return (
        <div className='Formular'>
             <label className='lblFormular'>*Unesite dodatne informacije o sebi - <label className='lblFormularInfo'>popuna ovih polja nije obavezna :</label> </label>
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
             <select   onChange={e=>bojaKose[1](e.target.value)}>
               <option >Plava</option>
               <option >Crna</option>
               <option >Smedja</option>
               <option >Crvena</option>
               <option >Ridja</option>
               <option >Ništa od ponudjenog</option>
             </select>
            </div>
            <div className="form-group">
              <label htmlFor="username">Boja očiju:</label>
             <select  onChange={e=>bojaOciju[1](e.target.value)}>
               <option >Plave</option>
               <option >Crne</option>
               <option >Zelene</option>
               <option >Braon</option>
             
             </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Omiljena knjiga:</label>
              <input type="text" name="username" placeholder="Omiljena knjiga"  onChange={e=>omiljenaKnjiga[1](e.target.value)} />    
            </div>
            <div className="form-group">
              <label htmlFor="username">Omiljeni film:</label>
              <input type="text" name="username" placeholder="Omiljeni film"  onChange={e=>omiljeniFilm[1](e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="username">Žanr muzike koju najradije slušate:</label>
              <input type="text" name="username" placeholder="Muzike"  onChange={e=>zanrMuzike[1](e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="username">Hobi:</label>
              <input type="text" name="username" placeholder="Hobi"  onChange={e=>hobi[1](e.target.value)} />
            </div>
            
            <button
                className='btnPocetna'
                onClick={handleHistory1} >
                Potvrdi
                </button>


            </div>
        </div>
    )
}
