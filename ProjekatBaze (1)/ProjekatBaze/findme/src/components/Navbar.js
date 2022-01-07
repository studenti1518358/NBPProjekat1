import React , {useEffect,useState} from 'react'
import './Navbar.css'
import { NavLink } from 'react-router-dom'
import $ from 'jquery'

const Navbar = () => {
  const [prikazi,setPrikazi]=useState(true)  
  const [prikaziOdjviSe,setPrikaziOdjaviSe]=useState(false)  

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
    
    animation()
    $(window).on('resize', function(){
      setTimeout(function(){ animation()}, 500)
    })
    let tok=localStorage.getItem("jwt");
        if(tok!=null)
        {
            setPrikazi(false)
            setPrikaziOdjaviSe(true)

        }
  }, [])
  const odjaviSe=()=>{
          
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
              <NavLink className="nav-link" to="/Predlozi" >
               Predlozi
              </NavLink>
            </li>

           {prikazi? <li className="nav-item">
              <NavLink className="nav-link" to="/prijaviSe" >
                Prijavi se
              </NavLink> 
            </li>:null}

          {prikazi? <li className="nav-item">
              <NavLink className="nav-link" to="/registracija/registrujSe" >
               Registruj se
              </NavLink>
            </li>:null}
          {setPrikaziOdjaviSe?
          <li className="nav-item">
          <NavLink className="nav-link" to="/" onClick={odjaviSe} >
           Odjavi se
          </NavLink>  </li>:null
        }  
           
        </ul>
        
      
      </div>
  </nav>
  )
} 
export default Navbar