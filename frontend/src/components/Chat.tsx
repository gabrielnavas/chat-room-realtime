import React, { MutableRefObject, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import io from 'socket.io-client'

import { Message, MessageKind } from '../entities/message';
import { getQueryParams } from '../services/room-service-component';
import { roomSocketNames } from '../services/room-service-websocket';

const socketIOUrl = import.meta.env.VITE_SOCKETIO_ENDPOINT

export const Chat = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = React.useMemo(() => getQueryParams(location), [location]);
  console.log(queryParams.name, queryParams.roomId);

  const socket = React.useMemo(() => {
    if (queryParams.roomId && queryParams.name) {
      return io(socketIOUrl);
    }
    return null;
  }, [queryParams.roomId, queryParams.name]);

  const [messages, setMessages] = useState<Message[]>([])
  const inputRef = useRef() as MutableRefObject<any>

  const sendMessage = () => {
    const message = inputRef.current.value
    if (!message || message.trim().length === 0) {
      return
    }
    if (socket?.disconnected) {
      console.log('esse socket foi desconectado');
    }
    socket?.emit('send-message', { message })
    inputRef.current.value = ''
  }

  React.useEffect(() => {
    socket?.on(roomSocketNames.connect, () => {
      console.log('abriu a conexão');
      socket?.emit('join', {
        roomId: queryParams.roomId,
        name: queryParams.name,
      })
    })
    socket?.on(roomSocketNames.receiveMessage, (message: Message) => {
      setMessages(messages => {
        const existsMessage = messages.some(m => m.id === message.id)
        if (!existsMessage) {
          return [...messages, { ...message }]
        }
        return messages
      })
    })
    socket?.on(roomSocketNames.error, (error: { message: string }) => {
      if(socket.connected) {
        alert(error.message)
        navigate('/')
      }
    })

    return () => {
      socket?.off(roomSocketNames.connect);
      socket?.off(roomSocketNames.receiveMessage);
    }
  }, [navigate, socket, queryParams.name, queryParams.roomId])

  return (
    <div>
      <div>
        <button onClick={() => navigate('/')}>Voltar para salas</button>
      </div>
      <h1>Chat</h1>
      <Messages messages={messages} />
      <p>
        <label htmlFor="message">Mensagem</label>
        <input type='text' id='message' ref={inputRef} />
        <button
          type="button"
          onClick={() => sendMessage()}>
          Enviar
        </button>
      </p>
    </div>
  )
}

const Messages = ({ messages }: { messages: Message[] }) => {
  return (
    <ul>
      {messages.map(message => (
        message.kind === MessageKind.Client
          ? <MessageClient name={message.name} text={message.text} />
          : <MessageServer text={message.text} />
      ))}
    </ul>
  )
}

const MessageClient = ({ name, text }: { name: string, text: string }) => {
  return (
    <li style={{
      fontWeight: 'bold',
      fontSize: '15px',
    }}>
      {name} disse {text}
    </li>
  )
}


const MessageServer = ({ text }: { text: string }) => {
  return (
    <li style={{
      fontWeight: '500',
      fontSize: '17px',
    }}>
      {text}
    </li>
  )
}