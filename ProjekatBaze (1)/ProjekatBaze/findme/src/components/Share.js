import "./Share.css";
import React,{useState,useEffect} from 'react' 
import axios from 'axios'

export default function Share() {
    const [profilnaSrc,setProfilnaSrc]=useState('/slike/profil.jpg')
    const [prikazFormeZaIzborSlike,setPrikazFormeZaIzborSlike]=useState(false)
    const [slikaSrc,setSlikaSrc]=useState()
    const [slikaFile,setSlikaFile]=useState()
    const [korisnickoIme,setKorisnickoIme]=useState("")

    const izmeniSliku=(e)=>{
      if(e.target.files && e.target.files[0])
      {
        let imgFile=e.target.files[0]
        const reader= new FileReader()
        reader.onload=x=>{
          
          setSlikaSrc(x.target.result)
        }
        reader.readAsDataURL(imgFile)
        setSlikaFile(imgFile)
        
       // setProfilnaIme(imgFile.name)
      }
    }
    const podeli=()=>{
      if(prikazFormeZaIzborSlike)
      {
      const formData=new FormData()
       formData.append("slikaFile",slikaFile)
       axios.put("http://localhost:5000/api/Objave/DodajNovuSliku/"+localStorage.getItem("username"),formData).then(p=>{  
         
        if(p!=null)
        {
         
         setPrikazFormeZaIzborSlike(false) 
        }
      })
    } 

    }
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={profilnaSrc} alt="" />
          <div className='sharePom'>
            {prikazFormeZaIzborSlike?
            <img src={slikaSrc} className='shareSlika' alt=""/> :null
            }
             {prikazFormeZaIzborSlike?null: <input
            placeholder="Šta ti je na umu?"
            className="shareInput"
          />}
          {prikazFormeZaIzborSlike? 
           <input type='file'
         placeholder='Izaberi sliku'
         id='profilnaSlika'
          className='form-control-file chooseFile' onChange={izmeniSliku}/>:null}
          </div>

        </div>
        <hr className="shareHr"/>
        <div className="shareBottom">
            <div className="shareOptions">
                <div className="shareOption">
                 
               
                <i class="far fa-file-image-o fa-lg" onClick={()=>setPrikazFormeZaIzborSlike(true)}></i>
                <span className="shareOptionText" onClick={()=>setPrikazFormeZaIzborSlike(true)} >Slika ili video</span>
                </div>
                <div className="shareOption">
                <i class="fa fa-tags fa-lg" ></i>
                    <span className="shareOptionText" onClick={()=>setPrikazFormeZaIzborSlike(false)}>Status</span>
                </div>
               
                
            </div>
            <button className="shareButton" onClick={()=>podeli()}>Podeli</button>
        </div>
      </div>
    </div>
  );
}