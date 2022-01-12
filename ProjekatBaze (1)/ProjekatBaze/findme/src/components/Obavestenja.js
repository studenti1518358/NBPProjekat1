import React, { useState, forwardRef, useImperativeHandle ,useEffect,useContext} from 'react'
import moment from 'moment'
import "./Obavestenja.css"
import {Context} from '../context/Store'

const Obavestenja = forwardRef(() => {
   let isShown = true;
    const [showObavestenja, setShowObavestenja] = useState(isShown);
    const [obavestenja,setObavestenja]=useState(null)
    const [state,dispatch] = useContext(Context);

    useEffect(()=>{

        const pokupiObavestenja=async()=>{
            console.log(state)
            const res=await fetch("http://localhost:5000/api/Objave/getNotifications/"+localStorage.getItem("username"))
            console.log(res)
            console.log(res.status)
            if(res.status===200){
                const notifikacije=await res.json()
                setObavestenja(notifikacije)
                console.log(notifikacije)

            }
        }
        pokupiObavestenja()

    },[])
   /* useImperativeHandle(ref, () => ({
        show(){
            isShown === false ? isShown = true : isShown = false
            setShowObavestenja(isShown);
        }
    }));*/
    return (
        <div className="card">
           
            <span className="card-title"> Obavestenja </span>
            <ul className="obavestenja">
                { obavestenja.map((item,index) => {
                    return (
                        <li key = {index}>
                            <span className="text-obavestenja"> {item.text} </span>
                            <div className="">
                              
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
})

export default Obavestenja