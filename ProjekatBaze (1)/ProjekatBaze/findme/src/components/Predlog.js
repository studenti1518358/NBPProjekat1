import React from 'react'
import './Predlog.css'
export default function Predlog() {
    return (
        <div className='predlog'>
            <div className='predlogDivImg'>
             <img
                className="predlogImg"
                src="slike/prof2.jpg"
                alt=""
              />
             <label>Marko Miljanic, 25</label> 
             
            </div>
            <div className='divPredlogOpis'>
                <div className='divPredlogOpisPom'>
                    <label>Mesto stanovanja:Niš</label>
                    <label>Pol:Muški</label>
                    <label>Zainteresovan za pol:Ženski</label>
                    <label>Status veze:Slobodan</label>
                    <label>Traži:Brak</label>
                </div>

               <div className='divPredlogOpisPom'>                 
               <h4>Opis:</h4>
               <label className='lblPreglogOpis'> Zdravo svima, ako ste za neobavezno druzenje i dopisivanje posalji zahtev i javi se.
                Ja sam diplomirani pravnik u potrazi za poslom i novom devojkom. Blablablabla
                </label>
                </div> 
                <div className='divPredlogDugmici'>
                <button
                className='btnPocetna'
                 >
                 Pošalji zahtev
                </button>
                <button
                className='btnPocetna'               
               >
                Poseti profil          
               </button>
               <button
                className='btnPocetna'               
               >
                Preskoči          
               </button>
                </div>
            </div>
        </div>
    )
}
