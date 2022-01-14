import {React,useEffect,useState} from 'react'
import './Fotografije.css'
import {useParams} from 'react-router-dom'

export default function Fotografije() {
    const [fotografije,setFotografije]=useState([])
    const {username}=useParams()
    useEffect(() => {
           fetch("http://localhost:5000/api/Objave/PreuzmiSlike/"+username).then(pod=>{
               pod.json().then(obv=>{
                   setFotografije(obv)  
                    
                   
                })
           })    
        },[])
    
    
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
