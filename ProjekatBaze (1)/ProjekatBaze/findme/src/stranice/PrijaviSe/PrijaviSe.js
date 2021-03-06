import React,{useState,useContext} from 'react'
import './PrijaviSe.css'
import {Context} from '../../context/Store'
import loginImg from "./love.svg"
import {Link,Navigate} from 'react-router-dom'
export default function PrijaviSe({setUsernam}) {
   
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const [state,dispatch] = useContext(Context);
    //console.log(context)
    const [redirect,setRedirect]=useState(false)
    const login=async ()=>{
      if(!username || !password){
        alert('Ne smete ostaviti prazna polja, morate uneti podatke!');
        return;
      }
        
      const response=await fetch('http://localhost:5000/api/Auth/loginUser',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        credentials:'include',
        body: JSON.stringify({
          username:username,
          password:password,
         }
  
        )
       
      })
      console.log(response)
      if(response.status===200){
        const response1=await fetch('http://localhost:5000/api/Auth/getUser',{
         
      headers:{'Content-Type':'application/json'},
      credentials:'include'
      
     
    })
      const body=await response1.json()
      console.log(body)
      localStorage.setItem("username",body.username)
    
      setUsernam(body.username)
     
      
     const korisnik=await fetch("http://localhost:5000/api/Auth/getUser", {
        headers:{'Content-Type':'application/json'},
        credentials:'include'
      })

      

      const podaci=await korisnik.json()
        
          
           
            localStorage.setItem("profilna",podaci.profilnaSrc)
            localStorage.setItem("username",podaci.username)
                             
           console.log(state)
           dispatch({type:'SET_USER',payload:body});
      setRedirect(true)

        
      }
      else{
        alert("Pogresan username ili mail! Pokusajte ponovo!")
      }
    }

    if(redirect)
       return (<Navigate to="/PocetnaStrana" />)

    return (

        <div className="base-container" >
        <div className="header">Dobrodo??li!</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt="login" />
            
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Korisni??ko ime</label>
              <input type="text" name="username" placeholder="Korisni??ko ime"  onChange={e=>setUsername(e.target.value)} />
            </div>
           
            
            <div className="form-group">
              <label htmlFor="password">??ifra</label>
              <input type="password" name="password" placeholder="??ifra"  onChange={e=>setPassword(e.target.value)}  />
    
            </div>
          </div>
        </div>
       
        <div className="form-group">
          <button type="button" className="btn"  onClick={login}>
            Prijavi se
          </button>
          <label className='labela'>Nemate nalog? <Link to='/registracija/registrujSe' >
                    Registruj se
             </Link></label>
        </div>
      </div>
    )
}
