import React from 'react'
import {useNavigate} from "react-router-dom"
import './UspesnoRegistrovanje.css'
export default function UspesnoRegistrovanje() {
   const navigate=useNavigate()
   const handleHistory1=()=>
  {
    navigate("/prijaviSe")
  }
    return (
        <div>
            <div className='divUspesnoRegistrovanje'>
                <h1 className='lblUspesnoReg'> Uspešno ste se registrovali.</h1>
                <h2 className='lblUspesnoRegg'>Prijavite se i započnite avanturu!</h2>
                <div className="form-group">
          <button type="button" className="btnUspesnoReg" onClick={handleHistory1} >Prijavi se</button>
         
        </div>

            </div>

            
        </div>
    )
}
