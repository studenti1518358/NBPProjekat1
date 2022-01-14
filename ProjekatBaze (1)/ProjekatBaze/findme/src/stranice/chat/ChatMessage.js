import {Message} from '@chatscope/chat-ui-kit-react'
import {useState} from 'react'
import "./chat.css"

export default function ChatMessage(props){
     const [showDate,setShowDate]=useState(false)
    const direction=props.message.usernameFrom===props.me?"outgoing":"incoming"
    return(<>
         <Message onClick={()=>setShowDate(prev=>!prev)}  model={{message:props.message.message,sentTime:new Date(Number(props.message.date)).toLocaleString(),sender:props.friend,direction:direction,position:"single"}} avatarSpacer>
          
            </Message>
            {showDate && <div className={'dateLabel '+direction}>{new Date(Number(props.message.date)).toLocaleString()}</div>}
            </>
    )

}