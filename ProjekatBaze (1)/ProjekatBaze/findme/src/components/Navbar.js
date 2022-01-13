import React , {useEffect,useState,useContext} from 'react'
import './Navbar.css'
import { NavLink } from 'react-router-dom'
import $ from 'jquery'
import {Context} from '../context/Store'

const Navbar = () => {
  //const [prikazi,setPrikazi]=useState(true)  
  const [prikaziOdjviSe,setPrikaziOdjaviSe]=useState(false)  
  const [state,dispatch]=useContext(Context);

  useEffect(()=>{

    if(localStorage.getItem("username"))
         setPrikaziOdjaviSe(true)

  },[state.user])

  function animation(){
    var tabsNewAnim = $('#navbarSupportedContent')
    var activeItemNewAnim = tabsNewAnim.find('.active')
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight()
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth()
   var itemPosNewAnimTop = activeItemNewAnim.position()
    var itemPosNewAnimLeft = activeItemNewAnim.position()
    $(".hori-selector").css({
      "top":itemPosNewAnimTop.top + "px", 
      "left":itemPosNewAnimLeft.left + "px",
      "height": activeWidthNewAnimHeight + "px",
      "width": activeWidthNewAnimWidth + "px"
    })
    $("#navbarSupportedContent").on("click","li",function(e){
      $('#navbarSupportedContent ul li').removeClass("active")
      $(this).addClass('active')
      var activeWidthNewAnimHeight = $(this).innerHeight()
      var activeWidthNewAnimWidth = $(this).innerWidth()
      var itemPosNewAnimTop = $(this).position()
      var itemPosNewAnimLeft = $(this).position()
      $(".hori-selector").css({
        "top":itemPosNewAnimTop.top + "px", 
        "left":itemPosNewAnimLeft.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
      })
    })
  }

  useEffect(() => {
    
    if(localStorage.getItem("username")!=null)
    {
      setPrikaziOdjaviSe(true)
    }
    animation()
    $(window).on('resize', function(){
      setTimeout(function(){ animation()}, 500)
    })
    
  }, [])
  const odjaviSe=async ()=>{

    localStorage.setItem("profilna",null)

    /*const response=*/await fetch('http://localhost:5000/api/Auth/logoutUser',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            credentials:'include'
           
           
          });
          setPrikaziOdjaviSe(true)
        //  setPrikazi(true)
    localStorage.clear()
    window.location.reload()
}
  return (
  <nav className="navbar navbar-expand-lg navbar-mainbg">
    
      <NavLink className="navbar-brand navbar-logo" to="/" >
        FindNewLove
      </NavLink>
      <button 
        className="navbar-toggler"
        onClick={ function(){
          setTimeout(function(){ animation()})
        }}
        type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <i className="fas fa-bars text-white"></i>
      </button>
    
      
      <div 
        className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
            
            <div className="hori-selector">
              <div className="left"></div>
              <div className="right"></div>
            </div>
            <li className="nav-item active">
              <NavLink className="nav-link" to="/Profil">
               Profil 
              </NavLink>
             
            </li>
            <li className="nav-item active">
              <NavLink className="nav-link" to="/PocetnaStrana" >
               Početna
              </NavLink>
            </li>

            <li className="nav-item active">
              <NavLink className="nav-link" to="/Predlozi/predlog0" >
               Predlozi
              </NavLink>
            </li>

           {prikaziOdjviSe? null: <li className="nav-item">
              <NavLink className="nav-link" to="/prijaviSe" >
                Prijavi se
              </NavLink> 
            </li>}

          {prikaziOdjviSe? null:<li className="nav-item">
              <NavLink className="nav-link" to="/registracija/registrujSe" >
               Registruj se
              </NavLink>
            </li>}
          {prikaziOdjviSe?
          <li className="nav-item">
          <NavLink className="nav-link" to="/PrijaviSe" onClick={odjaviSe} >
           Odjavi se
          </NavLink>  </li>:null
        }  
           
        </ul>
        
      
      </div>
  </nav>
  )
} 
export default Navbar