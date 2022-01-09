import "./Post.css"
import { useState,useEffect } from "react"
import { CustomDialog, useDialog } from 'react-st-modal';
import LikesDialog from "./likesDialog";
import CommentSection from "./CommentSection";


export default function Post({post}) {
  const [like,setLike] = useState(0)
  const [isLiked,setIsLiked] = useState(false)
  const [likes,setLikes]=useState([])
  const [commentsNum,setCommentsNum]=useState(0)
  const [profilnaSrc,setProfilnaSrc]=useState('/slike/profil.jpg')
  const [slika,setSlika]=useState('/slike/priroda.jpg')
  const [showComments,setShowComments]=useState(false)
  const isStatus=!post.slikaSrc?true:false
  //setProfilnaSrc(localStorage.getItem("profilna"))
  const likeHandler =async()=>{
    //setLike(isLiked ? like-1 : like+1)
    setIsLiked(!isLiked)
    setLike(prev=>prev+1)
    console.log(localStorage.getItem("profilna"))
    const newLike={username:localStorage.getItem("username"),slikaSrc:localStorage.getItem("profilna")}
    console.log(newLike)
    setLikes(prev=>[...prev,newLike])
    const result=await fetch("http://localhost:5000/api/Objave/lajkujObjavu?objavaId="+post.id,{
      
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
  const showLikes=async()=>{
    const result=await CustomDialog(<LikesDialog likes={likes} />)

  }
  useEffect(()=>{

    setLike(post.likes.length);
    setIsLiked(false)
    setLikes(post.likes)
    setCommentsNum(post.comments.length)
    for(let i=0;i<post.likes.length;i++){
      if(post.likes[i].username===localStorage.getItem("username"))
             setIsLiked(true)

    }


  },[post.likes])
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postProfileImg"
              src={post.autorSrc}
              alt=""
            />
            <span className="postUsername">
             {post.authorUsername}
            </span>
            <span className="postDate">{post.date}</span>
          </div>
          <div className="postTopRight">
         
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.text}</span>
          {!isStatus &&<img className="postImg" src={post.slikaSrc} alt="" />}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {isLiked && <span className="youLike">You like this.  </span>}
          {!isLiked &&
            <i  class="fa fa-thumbs-o-up fa-lg likeIcon"  onClick={likeHandler}></i>
          }
            <span onClick={showLikes} className="postLikeCounter">{like} people like it</span>
           
          </div>
          <div className="postBottomRight">
           
            <span  className="postCommentText" onClick={()=>setShowComments(true)}>{commentsNum} comments</span>
            
            
           
        
            
           

          </div>
       
         
          
        </div>
        {showComments && <CommentSection komentari={post.comments} postId={post.id} setShow={setShowComments} setCommentsNum={setCommentsNum} />}
        </div>
    </div>
  )
}