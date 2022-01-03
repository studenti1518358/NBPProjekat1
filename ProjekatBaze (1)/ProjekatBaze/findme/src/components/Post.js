import "./Post.css"
import { useState } from "react"


export default function Post() {
  const [like,setLike] = useState(10)
  const [isLiked,setIsLiked] = useState(false)
  const [profilnaSrc,setProfilnaSrc]=useState('/slike/profil.jpg')
  const [slika,setSlika]=useState('/slike/priroda.jpg')
  const likeHandler =()=>{
    setLike(isLiked ? like-1 : like+1)
    setIsLiked(!isLiked)
  }
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postProfileImg"
              src={profilnaSrc}
              alt=""
            />
            <span className="postUsername">
             Ana Milenkovic
            </span>
            <span className="postDate">10 min ago</span>
          </div>
          <div className="postTopRight">
         
          </div>
        </div>
        <div className="postCenter">
          <span className="postText"> Beautiful nature !!</span>
          <img className="postImg" src={slika} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
          <i class="fa fa-thumbs-o-up fa-lg"  onClick={likeHandler}></i>
           
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{10} comments</span>
          </div>
          
        </div>
      </div>
    </div>
  )
}