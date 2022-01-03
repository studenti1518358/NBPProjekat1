import React from 'react'
import './FormPrva.css'

export default function FormDruga() {
   
  
    return (
        <div className='Formular'>
             <label className='lblFormular'>*Popunite informacija o osobi koja Vas zanima kako bi poboljšali predloge i uskladili ih sa Vašim zahtevima:</label>
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
               <option>Svejedno</option>
             </select>
            </div>
            <div className="form-group">
              <label htmlFor="username">Boja očiju:</label>
             <select >
               <option >Plave</option>
               <option >Crne</option>
               <option >Zelene</option>
               <option >Braon</option>
               <option>Svejedno</option>
             </select>
            </div>
           
            <div className="form-group">
              <label htmlFor="username">Godine od:</label>
              <input type="number" name="username" placeholder="Godine" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Godine do:</label>
              <input type="number" name="username" placeholder="Godine" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Pol:</label>
             <select >
               <option >Muški</option>
               <option >Ženski</option>
             </select>
            </div>
            <button
                className='btnPocetna'
                 >
                Potvrdi
                </button>


            </div>
        </div>
    )
}
