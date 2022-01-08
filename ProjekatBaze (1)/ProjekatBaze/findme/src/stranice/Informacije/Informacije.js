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
           
        fetch("http://localhost:5000/api/User?username="+localStorage.getItem("username"), {
          headers:{'Content-Type':'application/json'},
          credentials:'include'
        }).then(korisnik=>{
           korisnik.json().then(podaci=>{
            
        
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
                <label className='lbllInfo'>Ime: {ime}</label>
                <label className='lbllInfo'>Prezime: {prezime}</label>
                <label className='lbllInfo'>Godine: {godine}</label>
                <label className='lbllInfo'>Mesto stanovanja: {grad}</label>
                <label className='lbllInfo'>Status veze: {status}</label>
                <label className='lbllInfo'>Zanimanje: {zanimanje}</label>
                <label className='lbllInfo'>Trazi: {trazi}</label>
            </div>

            <div className='divInfoPrvi'>
                <h4>Dodatne informacije:</h4>
                <label>          </label>
                <label>          </label>
                <label className='lblInfo'>Boja kose: {kosa}</label>
                <label className='lblInfo'>Boja ociju: {oci}</label>
                <label className='lblInfo'>Visina: {visina} cm</label>
                <label className='lblInfo'>Hobi: {hobi}</label>
                <label className='lblInfo'>Omiljeni zanr muzike: {muzika}</label>
                <label className='lblInfo'>Omiljeni film: {film}</label>
                <label className='lblInfo'>Omiljena knjiga: {knjiga}</label>
                
            </div>

            <div className='divInfoPrvi'>
                <h4>Od partnera očekuje:</h4>
                <label>          </label>
                <label>          </label>
                <label className='lblInfo'>Boja kose: {kosaPartnera}</label>
                <label className='lblInfo'>Boja ociju: {ociPartnera}</label>
                <label className='lblInfo'>Visina: {visinaPartnera} cm</label>
                
            
            </div>



        </div>
    )
}
