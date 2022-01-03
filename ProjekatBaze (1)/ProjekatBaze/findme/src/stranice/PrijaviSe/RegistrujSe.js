import React from 'react'
import './PrijaviSe.css'
import loginImg from "./love.svg"
import {Link} from 'react-router-dom'
export default function PrijaviSe() {
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
              <input type="text" name="username" placeholder="Korisničko ime" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Mail</label>
              <input type="text" name="username" placeholder="Korisničko ime" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Šifra</label>
              <input type="password" name="password" placeholder="Šifra"  />
    
            </div>
            <div className="form-group">
              <label htmlFor="password">Potvrdi šifru</label>
              <input type="password" name="password" placeholder="Šifra"  />
    
            </div>
          </div>
        </div>
       
        <div className="form-group">
          <button type="button" className="btn" >
            Prijavi se
          </button>
          <label className='labela'>Imate nalog? <Link to='/prijaviSe' >
                    Prijavi se
             </Link></label>
        </div>
      </div>
    )
}
