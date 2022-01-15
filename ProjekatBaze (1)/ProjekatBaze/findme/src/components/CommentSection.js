import {Button,Form,Header,Comment} from 'semantic-ui-react'
import Komentar from './Comment'
import {useState,useEffect} from 'react'
import './Komentari.css'



export default function CommentSection({komentari,postId,setShow,setCommentsNum}){
   
    const [kom,setNoviKomentar]=useState("")
    const [Komentari,setKomentari]=useState([])
    const closeComments=()=>{
        setShow(false)
    }
    useEffect(()=>{
        setKomentari(komentari)

    },[komentari])
    const komentarisi=async()=>{
        if(kom==="")
        return
        const text=kom
        const vreme=new Date().toLocaleString()
        const result=await fetch("http://localhost:5000/api/Objave/komentarisi",{
      
        method:"POST",
        headers:{'Content-Type':'application/json'},
       
        body:JSON.stringify(
          {
            objavaId:postId,
            date:vreme,
            text:kom,
            autorUsername:localStorage.getItem("username")
          
          }
        )
      }
    )
    const commentId=await result.json()
   
    console.log(vreme)
    const noviKomentar={
        id:commentId,
        objavaId:postId,
        authorUsername:localStorage.getItem("username"),
        autorSrc:localStorage.getItem('profilna'),
        date:vreme,
        text:text,
        likes:[]
    }
    setKomentari(prethodni=>[...prethodni,noviKomentar])
    setCommentsNum(prevNum=>prevNum+1)
    setNoviKomentar("")
    }
    return(<Comment.Group>
        <Header as='h3' dividing className="komentariHeder">
            Comments
           
        </Header>
        {Komentari.map((komentar,index)=>{
                return (<Komentar komentar={komentar} key={index} />)
            })}
        <Form dividing className='formaKoment' reply>
            <Form.Input value={kom} placeholder="Add your comment" className='commentBox' onChange={e=>setNoviKomentar(e.target.value)} />
            <Button dividing content='Add reply' labelPosition='left' icon='edit' primary onClick={komentarisi}/>

            
        </Form>
        <label className='zatvoriKomentare' onClick={closeComments}>x Close comments</label>
    </Comment.Group>)

}