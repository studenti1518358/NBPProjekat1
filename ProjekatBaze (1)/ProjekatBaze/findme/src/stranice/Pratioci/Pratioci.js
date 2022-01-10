import React,{useState,useEffect,useMemo} from 'react'
import "./Pratioci.css"
import PaginationComponent from '../../components/PaginationComponent'
export default function Pratioci() {
  
    const [ukupnoStavki,setUkupnoStavki]=useState(0)
    const [trStranica,setTrStranica]=useState(1)
    const [pratioci,setPratioci]=useState([])
    const STAVKE_PO_STRANICI=5
    useEffect(() => {
        //   const abortController=new AbortController()
   
           fetch("http://localhost:5000/api/Objave/getFollowers/"+localStorage.getItem("username")).then(pod=>{
               pod.json().then(obv=>{
                   setPratioci(obv)    
                  
                   console.log(pratioci)  
                   console.log(obv)  
                })
           })
        },[])
    const sviPratioci=useMemo(()=>{
      

        let obv=pratioci;
        
        setUkupnoStavki(obv.length)
    
        return obv.slice((trStranica-1)*STAVKE_PO_STRANICI,(trStranica-1)*STAVKE_PO_STRANICI+STAVKE_PO_STRANICI)

     },[pratioci,trStranica])
    
    
    return (
        <div className='divPratioci'> 
        <PaginationComponent
             ukupno={ukupnoStavki}
            stavkePoStranici={STAVKE_PO_STRANICI}
            trenutnaStranica={trStranica}
            promeniStranicu={page=>setTrStranica(page)}/>
          { sviPratioci.map((obv,i)=>(
            <div className='divPratilacGlavni'>
                <div className='divPratilac'>
               <img alt="" src={obv.item2} className='imgPratilac' key={i}/>
               <label  className='lblPratilac' key={i+25}>{obv.item1}</label>
               </div>
               <button className='btn btn-info btnIzmeniSliku' >Obrisi</button>
            </div>
         ))}
        </div>
    )
}
