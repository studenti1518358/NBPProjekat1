import "./Profil.css"
import Share from "../../components/Share"
import Post from '../../components/Post'
export default function Profile() {
  return (
    <>
      
      <div className="profile">
        
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src="/slike/priroda.jpg"
                alt=""
              />
              <img
                className="profileUserImg"
                src="slike/profil.jpg"
                alt=""
              />
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">Ana Milenkovic</h4>
                <span className="profileInfoDesc">Zdravo svima!</span>
            </div>
          </div>
          <div className="profileRightBottom">
           <Share/>
           <Post/>
          </div>
        </div>
      </div>
    </>
  )
}