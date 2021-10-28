import { useEffect, useState } from "react";
import io from "socket.io-client"

import styles from "./styles.module.scss";
import logoImg from '../../assets/logo.svg'
import { API } from "../../services/api";

type MessageProps = {
  id:string,
  text: string,
  user:{
    name:string
    avatar_url:string,
  }
}

const messagesQueue: MessageProps[] = []
const socket = io("http://localhost:3333");

socket.on('new_message', (newMessage)=>{
  messagesQueue.push(newMessage)
})

export function MessageList(){
  const [lastTreeMessages, setLastTreeMessages ] = useState<MessageProps[]>([])

  useEffect(()=>{
  setInterval(()=>{
      if(messagesQueue.length > 0){
        setLastTreeMessages( prevState => [messagesQueue[0], prevState[0], prevState[1]].filter(Boolean))

        messagesQueue.shift()
      }
    }, 3000)
  },[])

  useEffect(()=>{
    const getMessages = async ()=>{
     const {data}= await API.get<MessageProps[]>("/messages/last3")
     setLastTreeMessages(data)
    }

    getMessages()
  },[])
  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {lastTreeMessages.map((msg:MessageProps)=>(
          <li className={styles.message} key={msg.id}>
            <p className={styles.messageContent}>
              {msg.text}
            </p>
            <div className={styles.messageUser}>
              <div className={styles.userImg}>
                <img src={msg.user.avatar_url} alt="avatar github"/>
              </div>
              <span>{msg.user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
    )
}