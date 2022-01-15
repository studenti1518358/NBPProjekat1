import React,{useEffect,useState} from 'react'
import './Informacije.css'
import {useParams} from 'react-router-dom'
export default function Informacije() {
  // const [informacije,setInformacije]=useState([])
   const [ime,setIme] =useState("")
   const [slika,setSlika]=useState("")
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
   const [podaci,setPodaci]=useState({})

   const {username}=useParams()
   const myProfile=username===localStorage.getItem("username")?true:false;
   const update=async()=>{
       const izmenjenUser={
        user: {
            bracniStatus: status,
            email:podaci.user.email,
            godine: godine.toString(),
            id: podaci.user.id,
            ime: ime,
            mesto: grad,
            password:podaci.user.password,
            pol: podaci.user.pol,
            prezime: prezime,
            zanimanje: zanimanje,
            username: podaci.user.username,
            polPartnera: podaci.user.polPartnera,
            godineOd: podaci.user.godineOd.toString(),
            godineDo: podaci.user.godineDo.toString(),
            profilnaSrc: podaci.user.profilnaSrc,
            naslovnaSrc: podaci.user.naslovnaSrc,
            opis: podaci.user.opis,
            tipVeze: trazi,
            isOnline: true,
            lastSeen: "string"
          },
          osobine: [
            {
              name: "TipVeze",
              value: trazi
            },
            {
                name: "Hobi",
                value: hobi
              },
              {
                name: "ZanrMuzike",
                value: muzika
              },
              {
                name: "OmiljeniFilm",
                value: film
              },
              {
                name: "OmiljenaKnjiga",
                value: knjiga
              },
              {
                name: "BojaOciju",
                value: oci
              },
              {
                name: "BojaKose",
                value: kosa
              },
              {
                name: "Visina",
                value: visina.toString()
              },
              {
                name: "Tezina",
                value: podaci.osobine[7].value.toString()
              }
          ],
          pozeljneOsobine: [
            {
                name: "BojaOciju",
                value: ociPartnera
              },
              {
                name: "BojaKose",
                value: kosaPartnera
              },
              {
                name: "Visina",
                value: visinaPartnera.toString()
              },
              {
                name: "Tezina",
                value: podaci.pozeljneOsobine[2].value.toString()
              }
          ]
       }
      const result= await fetch("http://localhost:5000/api/User/updateUser/"+username,{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(izmenjenUser)
       })
       console.log(await result.json())
       console.log(izmenjenUser)
   }

    useEffect(() => {
           
        fetch("http://localhost:5000/api/User/GetUser/"+username, {
          headers:{'Content-Type':'application/json'},
          credentials:'include'
        }).then(korisnik=>{
           korisnik.json().then(podaci=>{
            setPodaci(podaci)
           console.log(podaci)
            setIme(podaci.user.ime)
            setPrezime(podaci.user.prezime)
            setGodine(podaci.user.godine)
            setStatus(podaci.user.bracniStatus)
            setGrad(podaci.user.mesto)
            setSlika(podaci.user.profilnaSrc)
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
                <img src={slika }alt="" className="profilnaInfo"></img>
                <label className='lblInfo'>Ime: <input onChange={(e)=>setIme(e.target.value)} value= {ime} className='infoInput'/></label>
                <label className='lblInfo'>Prezime: <input onChange={(e)=>setPrezime(e.target.value)} value= {prezime} className='infoInput'/></label>
                <label className='lblInfo'>Godine: <input onChange={(e)=>setGodine(e.target.value)} value= {godine} className='infoInput'/></label>
                <label className='lblInfo'>Mesto stanovanja: <input onChange={(e)=>setGrad(e.target.value)} value= {grad} className='infoInput'/></label>
                <label className='lblInfo'>Status veze: <input onChange={(e)=>setStatus(e.target.value)} value= {status} className='infoInput'/></label>
                <label className='lblInfo'>Zanimanje: <input onChange={(e)=>setZanimanje(e.target.value)} value= {zanimanje} className='infoInput'/></label>
                <label className='lblInfo'>Trazi: <input onChange={(e)=>setTrazi(e.target.value)} value= {trazi} className='infoInput'/></label>
            </div>

            <div className='divInfoPrvi'>
                <h4>Dodatne informacije:</h4>
                <label>          </label>
                <label>          </label>
                <label className='lblInfo'>Boja kose: <input onChange={(e)=>setKosa(e.target.value)} value= {kosa} className='infoInput'/></label>
                <label className='lblInfo'>Boja ociju: <input onChange={(e)=>setOci(e.target.value)} value= {oci} className='infoInput'/></label>
                <label className='lblInfo'>Visina: <input onChange={(e)=>setVisina(e.target.value)} value= {visina} className='infoInput'/> </label>
                <label className='lblInfo'>Hobi: <input onChange={(e)=>setHobi(e.target.value)} value= {hobi} className='infoInput'/></label>
                <label className='lblInfo'>Omiljeni zanr muzike: <input onChange={(e)=>setMuzika(e.target.value)} value= {muzika} className='infoInput'/></label>
                <label className='lblInfo'>Omiljeni film: <input onChange={(e)=>setFilm(e.target.value)} value= {film} className='infoInput'/></label>
                <label className='lblInfo'>Omiljena knjiga: <input onChange={(e)=>setKnjiga(e.target.value)} value= {knjiga} className='infoInput'/></label>
                
            </div>

            <div className='divInfoPrvi'>
                <h4>Od partnera očekuje:</h4>
                <label>          </label>
                <label>          </label>
                <label className='lblInfo'>Boja kose: <input onChange={(e)=>setKosaPartnera(e.target.value)} value= {kosaPartnera} className='infoInput'/> </label>
                <label className='lblInfo'>Boja ociju: <input onChange={(e)=>setOciPartnera(e.target.value)} value= {ociPartnera} className='infoInput'/> </label>
                <label className='lblInfo'>Visina:  <input onChange={(e)=>setVisinaPartnera(e.target.value)} value={visinaPartnera} className='infoInput'/> </label>
                <div className='divDugmeInfo'>
                <button className='btn btn-info dugmeInformacije' onClick={update}> Izmeni</button>
                </div>
            </div>



        </div>
    )
}
