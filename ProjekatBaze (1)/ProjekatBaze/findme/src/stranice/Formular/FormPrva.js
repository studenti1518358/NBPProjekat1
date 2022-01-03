import React from 'react'
import './FormPrva.css'
import {useNavigate} from "react-router-dom"
export default function FormPrva() {
    const navigate=useNavigate()
   const handleHistory1=()=>
  {
    navigate("/formDruga")
  }
  
    return (
        <div className='Formular'>
             <label className='lblFormular'>*Unesite dodatne informacije o sebi - <label className='lblFormularInfo'>popuna ovih polja je obavezna :</label> </label>
            <div className='divFormularPrva'>
              
            <div className="form-group">
              <label htmlFor="username">Ime:</label>
              <input type="text" name="username" placeholder="Ime" />    
            </div>
            <div className="form-group">
              <label htmlFor="username">Prezime:</label>
              <input type="text" name="username" placeholder="Prezime" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Godine:</label>
              <input type="number" name="username" placeholder="Godine" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Pol:</label>
             <select >
               <option >Muški</option>
               <option >Ženski</option>
             </select>
            </div>
            <div className="form-group">
              <label htmlFor="username">Mesto stanovanja:</label>
              <input type="text" name="username" placeholder="Mesto stanovanja" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Zanimanje:</label>
              <input type="text" name="username" placeholder="Zanimanje" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Bračni status:</label>
             <select >
               <option >Slobodan</option>
               <option >U braku</option>
               <option >U vezi</option>
             </select>
            </div>
            <div className="form-group">
              <label htmlFor="username">Šta tražim na ovoj aplikaciji:</label>
             <select >
               <option >Veza</option>
               <option >Braku</option>
               <option >Zabava</option>
               <option >Prijateljstvo</option>
             </select>
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
