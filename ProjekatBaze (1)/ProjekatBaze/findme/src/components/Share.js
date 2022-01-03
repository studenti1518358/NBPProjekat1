import "./Share.css";
import React,{useState,useEffect} from 'react'
import {FontAwesomeIcon}  from '@fortawesome/fontawesome-free'
//import {PermMedia} from '@material-ui/icons/PermMedia'
export default function Share() {
    const [profilnaSrc,setProfilnaSrc]=useState('/slike/profil.jpg')
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={profilnaSrc} alt="" />
          <input
            placeholder="Šta ti je na umu?"
            className="shareInput"
          />
        </div>
        <hr className="shareHr"/>
        <div className="shareBottom">
            <div className="shareOptions">
                <div className="shareOption">
                 
               
                <i class="far fa-file-image-o fa-lg"></i>
                <span className="shareOptionText">Slika ili video</span>
                </div>
                <div className="shareOption">
                <i class="fa fa-tags fa-lg" ></i>
                    <span className="shareOptionText">Tag</span>
                </div>
                <div className="shareOption">
                <i class="fa fa-map-marker fa-lg" ></i>
                    <span className="shareOptionText">Lokacija</span>
                </div>
                
            </div>
            <button className="shareButton">Podeli</button>
        </div>
      </div>
    </div>
  );
}