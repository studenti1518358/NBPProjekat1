import {React,useEffect,useState} from 'react'
import './Fotografije.css'
export default function Fotografije() {
    const [fotografije,setFotografije]=useState([])
    useEffect(() => {
           fetch("http://localhost:5000/api/Objave/PreuzmiSlike/"+localStorage.getItem("username")).then(pod=>{
               pod.json().then(obv=>{
                   setFotografije(obv)  
                   console.log(obv)
                   console.log(fotografije)  
                   
                })
           })    
        },[])
    
     /* {fotografije.map((src,i)=>{
                return(
                    <div className='pics' key={i}>
                        cao
                    </div>
                )
            })}*/ 
    return (
        <>
        <div className='gallery'>
        {fotografije.map((src,i)=>{
                return(
                    <div className='pics' key={i}>
                        <img src={src} alt='' />
                    </div>
                )
            })}
        </div>
        </>
    )
}
