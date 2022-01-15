import {React,useEffect,useState} from 'react'
import './Fotografije.css'
import {useParams} from 'react-router-dom'

export default function Fotografije() {
    const [fotografije,setFotografije]=useState([])
    const {username}=useParams()
    const [dugme,setDugme]=useState(false)
    useEffect(() => {
           fetch("http://localhost:5000/api/Objave/PreuzmiSlike/"+username).then(pod=>{
               pod.json().then(obv=>{
                   setFotografije(obv)  
                    
                   
                })
           })  
           if(username===localStorage.getItem("username"))
           {
               setDugme(true)
           }  

        },[])
    
    const ObrisiSliku=async (src)=>{
       fetch("http://localhost:5000/api/Del/deletePhoto/"+localStorage.getItem("username"),{
            method:"DELETE",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(src.src)
            }).then(async p=>{
               // console.log(await p.json())
                if(p.ok)
                {
                    window.location.reload()
                }
                console.log(p)
            })
            console.log(src.src.toString())
         
    }
    return (
        <>
        <div className='gallery'>
        {fotografije.map((src,i)=>{
                return(
                    <div className='pics' key={i}>
                        <img src={src} alt='' />
                       {dugme? <button onClick={()=>ObrisiSliku({src})}>Obrisi sliku</button> :null}
                    </div>
                )
            })}
        </div>
        </>
    )
}
