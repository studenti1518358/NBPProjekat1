import React from 'react'
import './Predlog.css'
import {NavLink} from 'react-router-dom'
export default function Predlog({korisnik,indeks}) {
    const sledeci=indeks+1;
    return (
        <div className='predlog'>
            <div className='predlogDivImg'>
             <img
                className="predlogImg"
                src={korisnik.profilnaSrc}
                alt=""
              />
             <label>{korisnik.ime+" "+korisnik.prezime+", "+korisnik.godine}</label> 
             
            </div>
            <div className='divPredlogOpis'>
                <div className='divPredlogOpisPom'>
                    <label>{"Mesto stanovanja "+korisnik.mesto}</label>
                    <label>{"Pol: "+korisnik.pol}</label>
                    <label>{'Zainteresovan za pol: '+korisnik.polPartnera}</label>
                    <label>{"Status veze: "+korisnik.bracniStatus}</label>
                    <label>{"Traži: "+korisnik.tipVeze}</label>
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
               <NavLink to={"/Predlozi/predlog"+sledeci}>
               <button
                className='btnPocetna'               
               >
                Preskoči          
               </button>
               </NavLink>
                </div>
               
            </div>
        </div>
    )
}
