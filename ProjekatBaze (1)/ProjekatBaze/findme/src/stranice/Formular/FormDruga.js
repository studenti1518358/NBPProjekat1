import React from 'react'
import './FormPrva.css'
import {useNavigate} from "react-router-dom"
export default function FormDruga() {
    const navigate=useNavigate()
   const handleHistory1=()=>
  {
    navigate("/formTreca")
  }
  
    return (
        <div className='Formular'>
             <label className='lblFormular'>*Unesite dodatne informacije o sebi - <label className='lblFormularInfo'>popuna ovih polja nije obavezna :</label> </label>
            <div className='divFormularPrva'>
            <div className="form-group">
              <label htmlFor="username">Visina:</label>
              <input type="number" name="username" placeholder="Visina" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Težina:</label>
              <input type="number" name="username" placeholder="Težina" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Boja kosa:</label>
             <select >
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
             <select >
               <option >Plave</option>
               <option >Crne</option>
               <option >Zelene</option>
               <option >Braon</option>
             
             </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Omiljena knjiga:</label>
              <input type="text" name="username" placeholder="Omiljena knjiga" />    
            </div>
            <div className="form-group">
              <label htmlFor="username">Omiljeni film:</label>
              <input type="text" name="username" placeholder="Omiljeni film" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Žanr muzike koju najradije slušate:</label>
              <input type="number" name="username" placeholder="Muzike" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Hobi:</label>
              <input type="text" name="username" placeholder="Hobi" />
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
