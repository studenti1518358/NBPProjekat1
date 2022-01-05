import React from 'react'
import './Pocetna.css'
import {useNavigate} from "react-router-dom"
export default function Pocetna() {
  const navigate=useNavigate()
   const handleHistory1=()=>
  {
    navigate("/prijaviSe")
  }
  const handleHistory2=()=>
  {
    navigate("/registracija/registrujSe")
  }
    return (
        <div className='pocetna-container'>
        <div className='NaslovDiv'>
        <h1 className='Naslov'>Find someone</h1>
        <h1 className='Naslov'>Who will change your life</h1>
        </div>
        <div className="pocetna-Dugmici">
            
                <button
                className='btnPocetna'
                onClick={handleHistory1} >
                 Prijavi se
                </button>
                <button
                className='btnPocetna'               
                onClick={handleHistory2} >
                Pridruži se          
               </button>
               
            </div>
        
           
            
            
        </div>

    )
}
