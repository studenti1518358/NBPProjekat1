import {Button,Comment} from 'semantic-ui-react'
import {useState,useEffect} from 'react'
import { CustomDialog, useDialog } from 'react-st-modal';
import LikesDialog from "./likesDialog";
import {useNavigate} from 'react-router-dom'

export default function Komentar({komentar}){
    const navigate=useNavigate()
    const [likesTotal,setLikesTotal]=useState(0)
    const [isLiked,setIsLiked]=useState(false)
    const [likes,setLikes]=useState([])
    useEffect(()=>{
        setLikesTotal(komentar.likes.length)
        setLikes(komentar.likes)
        for(let i=0;i<komentar.likes.length;i++)
           if(komentar.likes[i].username===localStorage.getItem("username"))
                setIsLiked(true)

    },[komentar]
    )
    const showLikes=async()=>{
        const result=await CustomDialog(<LikesDialog likes={likes} />)
    
      }

    const likeHandler =async()=>{
        //setLike(isLiked ? like-1 : like+1)
        setIsLiked(!isLiked)
        setLikesTotal(prev=>prev+1)
        console.log(localStorage.getItem("profilna"))
        const newLike={username:localStorage.getItem("username"),slikaSrc:localStorage.getItem("profilna")}
        console.log(newLike)
        setLikes(prev=>[...prev,newLike])
        const result=await fetch("http://localhost:5000/api/Objave/lajkujKomentar?komentarId="+komentar.id,{
          
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(
              {
                slikaSrc:localStorage.getItem('profilna'),
                username:localStorage.getItem('username')
              
              }
            )
          }
        )
    
      }
    return(
        <Comment className='komentar'>
            <Comment.Avatar className='commentAvatar' src={komentar.autorSrc}/>
            <Comment.Content>
                <Comment.Author onClick={()=>navigate('/profil/'+komentar.authorUsername)} as='a'>{komentar.authorUsername}</Comment.Author>
                <Comment.Metadata><div>{komentar.date}</div></Comment.Metadata>
                <Comment.Text>{komentar.text}</Comment.Text>
                <Comment.Actions>
                    <label className='commentLikeLabel' onClick={showLikes} >{likesTotal} people like this</label>
                    {!isLiked && <Comment.Action onClick={likeHandler}>Like</Comment.Action>}
                    {isLiked && <label className='malaLabela'>You like this.</label> }
                </Comment.Actions>
            </Comment.Content>

        </Comment>
    )

}