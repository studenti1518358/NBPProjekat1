import { CustomDialog, useDialog } from 'react-st-modal';
import React,{useState} from 'react'

// The element to be shown in the modal window
export default function LikesDialog({likes}) {
  // use this hook to control the dialog
  const dialog = useDialog();

  //const [] = useState();

  return (
    <div>
        <h4>Osobe kojima se ovo svidja:</h4>
       {likes.map((like,index)=>{
           const username=like.username===localStorage.getItem("username")?'Vi':like.username
          return (<div><img
            className="postProfileImg likeIkonica"
            src={like.slikaSrc}
            alt=""
          /><span className="likeUsername">{username}</span></div>)
       })}
      

       <button className="okLikeButton"
        onClick={() => {
          // Сlose the dialog and return the value
          console.log(likes)
          dialog.close();
        }}
      >
        Ok
      </button>
    </div>
  );
}