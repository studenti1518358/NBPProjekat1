import React,{useState} from 'react'
import './PrijaviSe.css'
import loginImg from "./love.svg"
import {Link} from 'react-router-dom'
import { NavLink } from 'react-router-dom'
export default function ReigstrujSe({username,email,password}) {
  const loguj=()=>{
    console.log(username[0])
    console.log(email[0])
    console.log(password[0])
  }
  const [passwordChech,setPasswordCheck]=useState("")
    return (

        <div className="base-container" >
        <div className="header">Dobrodošli!</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt="login" />
            
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Korisničko ime</label>
              <input type="text" name="username" placeholder="Korisničko ime" onChange={e=>username[1](e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="username">Mail</label>
              <input type="text" name="username" placeholder="Email" onChange={e=>email[1](e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Šifra</label>
              <input type="password" name="password" placeholder="Šifra"  onChange={e=>password[1](e.target.value)}/>
    
            </div>
            <div className="form-group">
              <label htmlFor="password">Potvrdi šifru</label>
              <input type="password" name="password" placeholder="Šifra"  />
    
            </div>
          </div>
        </div>
       
        <div className="form-group">
          <button type="button" className="btn" >
               <NavLink className="nav-link" to="/registracija/formPrva" exact onClick={loguj}>
               Dalje
              </NavLink>
        
          </button>
          <label className='labela'>Imate nalog? <Link to='/prijaviSe' >
                    Prijavi se
             </Link></label>
        </div>
      </div>
    )
}
