import React,{useEffect,useState} from 'react'
import './Informacije.css'
export default function Informacije() {
  // const [informacije,setInformacije]=useState([])
   const [ime,setIme] =useState("")
   const [prezime,setPrezime] =useState("")
   const [hobi,setHobi] =useState("")
   const [godine,setGodine] =useState(0)
   const [grad,setGrad] =useState("")
   const [status,setStatus] =useState("")
   const [zanimanje,setZanimanje]= useState("")
   const [trazi,setTrazi] =useState("")
   const [muzika,setMuzika] =useState("")
   const [film,setFilm] =useState("")
   const [knjiga,setKnjiga] =useState("")
   const [kosa,setKosa] =useState("")
   const [oci,setOci] =useState("")
   const [visina,setVisina] =useState(0)
   const [kosaPartnera,setKosaPartnera] =useState("")
   const [ociPartnera,setOciPartnera] =useState("")
   const [visinaPartnera,setVisinaPartnera] =useState(0)
    useEffect(() => {
           
        fetch("http://localhost:5000/api/User/GetUser/"+localStorage.getItem("username"), {
          headers:{'Content-Type':'application/json'},
          credentials:'include'
        }).then(korisnik=>{
           korisnik.json().then(podaci=>{
            
           console.log(podaci)
            setIme(podaci.user.ime)
            setPrezime(podaci.user.prezime)
            setGodine(podaci.user.godine)
            setStatus(podaci.user.bracniStatus)
            setGrad(podaci.user.mesto)
            setZanimanje(podaci.user.zanimanje)
            setTrazi(podaci.osobine[0].value)
            setHobi(podaci.osobine[1].value)
            setMuzika(podaci.osobine[2].value)
            setFilm(podaci.osobine[3].value)
            setKnjiga(podaci.osobine[4].value)
            setOci(podaci.osobine[5].value)
            setKosa(podaci.osobine[6].value)
            setVisina(podaci.osobine[8].value)
            setOciPartnera(podaci.pozeljneOsobine[0].value)
            setKosaPartnera(podaci.pozeljneOsobine[1].value)
            setVisinaPartnera(podaci.pozeljneOsobine[3].value)
            console.log(podaci.pozeljneOsobine)
           })
      })
},[])

    return (
        <div className="divGlavniInformacije">
            <div className='divInfoPrvi'>
                <img src={localStorage.getItem("profilna") }alt="" className="profilnaInfo"></img>
                <label className='lblInfo'>Ime: <input value= {ime} className='infoInput'/></label>
                <label className='lblInfo'>Prezime: <input value= {prezime} className='infoInput'/></label>
                <label className='lblInfo'>Godine: <input value= {godine} className='infoInput'/></label>
                <label className='lblInfo'>Mesto stanovanja: <input value= {grad} className='infoInput'/></label>
                <label className='lblInfo'>Status veze: <input value= {status} className='infoInput'/></label>
                <label className='lblInfo'>Zanimanje: <input value= {zanimanje} className='infoInput'/></label>
                <label className='lblInfo'>Trazi: <input value= {trazi} className='infoInput'/></label>
            </div>

            <div className='divInfoPrvi'>
                <h4>Dodatne informacije:</h4>
                <label>          </label>
                <label>          </label>
                <label className='lblInfo'>Boja kose: <input value= {kosa} className='infoInput'/></label>
                <label className='lblInfo'>Boja ociju: <input value= {oci} className='infoInput'/></label>
                <label className='lblInfo'>Visina: <input value= {visina} className='infoInput'/> </label>
                <label className='lblInfo'>Hobi: <input value= {hobi} className='infoInput'/></label>
                <label className='lblInfo'>Omiljeni zanr muzike: <input value= {muzika} className='infoInput'/></label>
                <label className='lblInfo'>Omiljeni film: <input value= {film} className='infoInput'/></label>
                <label className='lblInfo'>Omiljena knjiga: <input value= {knjiga} className='infoInput'/></label>
                
            </div>

            <div className='divInfoPrvi'>
                <h4>Od partnera očekuje:</h4>
                <label>          </label>
                <label>          </label>
                <label className='lblInfo'>Boja kose: <input value= {kosaPartnera} className='infoInput'/> </label>
                <label className='lblInfo'>Boja ociju: <input value= {ociPartnera} className='infoInput'/> </label>
                <label className='lblInfo'>Visina:  <input value={visinaPartnera} className='infoInput'/> </label>
                <div className='divDugmeInfo'>
                <button className='btn btn-info dugmeInformacije'> Izmeni</button>
                </div>
            </div>



        </div>
    )
}
