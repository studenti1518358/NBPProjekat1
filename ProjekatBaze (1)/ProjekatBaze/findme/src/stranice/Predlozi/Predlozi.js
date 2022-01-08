import React,{useState,useEffect} from 'react'
import './Predlozi.css'
import Predlog from '../../components/Predlog'
import {Route,Routes} from 'react-router-dom'
import NemaVise from '../../NemaVise'

export default function Predlozi() {
   const  [users,setUsers]=useState([])
   useEffect(() => {
    console.log("hi");
    const asyncFetch=async ()=>{
      const response1=await fetch('http://localhost:5000/api/User/matches?username='+localStorage.getItem("username"));
      const listaStavki=await response1.json();
      setUsers(listaStavki)
      console.log(listaStavki)

    }

  
  
    asyncFetch();
  },[] );
    return (
        <Routes className='predlozi'>
            {users.map((user,index)=>{
                return (<Route key={index} path={'/predlog'+index} element={<Predlog korisnik={user} indeks={index}/>} />)
            })}
            <Route path={"/predlog"+users.length} element={<NemaVise />}></Route>
        </Routes>
    )
}
