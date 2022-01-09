import React,{useEffect,useState} from 'react'
import './Novosti.css'
import Share from '../../components/Share'
import Post from '../../components/Post'
export default function Novosti() {
    const [objave,setObjave]=useState([])
    useEffect(()=>{

        const ucitajObjave=async()=>{
            const rez=await fetch("http://localhost:5000/api/Objave/getZid/"+localStorage.getItem("username"))
            const objave=await rez.json()
            console.log(objave)
            setObjave(objave)
        }
        ucitajObjave()

    },[])

    return (
        <div className='divNovosti'>
        <Share/>
        {objave.map((objava,index)=>{
            return (<Post post={objava} key={index}></Post>)
        })}
        </div>
    )
}
