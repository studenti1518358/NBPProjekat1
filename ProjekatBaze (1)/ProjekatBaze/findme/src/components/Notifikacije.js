
import {useState,useEffect,useContext,useRef} from 'react'
import {Context} from '../context/Store'
import {Message} from 'semantic-ui-react'
import moment from 'moment'
export default function Notifikacije(props){
    console.log(props.novaNotifikacija)
    const [notifikacije,setNotifikacije]=useState([])
    const [state,dispatch] = useContext(Context);
    const [showNotifikacije,setShownotifikacije]=useState(false)
    const [brojNotifikacija,setBrojNotifikacija]=useState(0)
    const ref=useRef()

    const closeNotifications=(e)=>{
        if(showNotifikacije && ref.current && !ref.current.contains(e.target))
                    setShownotifikacije(false)

    }
    document.addEventListener('mousedown',closeNotifications)
    const procitajSve=async()=>{
        setNotifikacije(prev=>prev.map(notf=>{
            const nova={...notf}
            nova.isRead='read'
            return nova
        }))
        setBrojNotifikacija(0)
        await fetch("http://localhost:5000/api/Objave/oznaciNotifikacijeKaoProcitane/"+localStorage.getItem("username"))
    }
    useEffect(()=>{
        if(props.novaNotifikacija)
        {
            
            props.novaNotifikacija.isRead='unread'
            setNotifikacije(prev=>[props.novaNotifikacija,...prev])
            setBrojNotifikacija(prev=>prev+1)
        }
        console.log(props.novaNotifikacija)
    },[props.novaNotifikacija])
    useEffect(()=>{
        

        const pokupiObavestenja=async()=>{
            //console.log(state)
            let broj=0
            const res1=await fetch("http://localhost:5000/api/Objave/getUnread/"+localStorage.getItem("username"))
            if(res1.status===200)
            {  broj=await res1.json()
                console.log(broj)
                setBrojNotifikacija(broj)
            }
            const res=await fetch("http://localhost:5000/api/Objave/getNotifications/"+localStorage.getItem("username"))
            console.log(res)
            console.log(res.status)
            if(res.status===200){
                let nots=await res.json()
                console.log(nots)
                nots=nots.map((notf,index)=>{
                    const nnotf={...notf}
                    nnotf.isRead=index<broj?'unread':'read'
                    return nnotf
                })
               setNotifikacije(nots)
                console.log(nots)
              // localStorage.clear()
                console.log("cao")

            }
        }
        pokupiObavestenja()

    },[state.user])

    return(
      <>
      <div >
          <svg onClick={()=>setShownotifikacije(prev=>!prev)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell ikonicaBar" viewBox="0 0 16 16">
          
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
         </svg>
        
         <span className="topbarIconBadge">{brojNotifikacija}</span>
         </div>
        {showNotifikacije &&  <div ref ={ref} className='notifikacije'  style={{position:'absolute',overflow:'auto',right:'-100px',top:'50px'}}>
              <div onClick={procitajSve} className='oznaci'>{'<Oznaci kao procitane>'}</div>
        {notifikacije.map((item,index)=>{
            console.log(item.isRead)
            return(
                <Message style={{margin:"0px"}} className={item.isRead}>
                    <Message.Header>{moment(Date.parse(item.date)).fromNow()}</Message.Header>
                    {item.text}
                </Message>
            )
        })}
        </div>}
      </>
    )
}