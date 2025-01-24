/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import { Room as RoomType } from "../entities/room"
import { findRooms } from "../services/room-service-http"
import { useNavigate } from "react-router"



export const Rooms = () => {

  const [rooms, setRooms] = useState<RoomType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const inputRef = useRef() as MutableRefObject<any>

  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    findRooms()
      .then(roms => setRooms(roms))
      .catch(err => setError(err))
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const goToChatOnClick = useCallback((roomId: number) => {
    const name = inputRef.current.value
    if(!name) {
      alert('Digite um nome.')
      return
    }
    if(roomId <= 0) {
      throw new Error('room id is zero')
    }
    const url = `/chat?roomId=${roomId}&name=${name}`
    navigate(url)
  }, [navigate])

  if (isLoading) {
    <LoadingRooms />
  }

  if (error) {
    <ErrorRooms error={error} />
  }

  if (rooms.length === 0) {
    return <EmptyRooms />
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
    }}>
      <header>
        <h2>Salas</h2>
      </header>
      <p>
        <label htmlFor="name">Nome</label>
        <input type='text' id='name' ref={inputRef} />
      </p>
      <ul>
        {rooms.map(room => (
          <Room
            key={room.id}
            onClick={() => goToChatOnClick(room.id)}
            room={room}
          />
        ))}
      </ul>
    </div>
  )
}

const Room = ({ room, onClick }: { room: RoomType, onClick: () => void }) => {
  return (
    <li style={{cursor: 'pointer'}} onClick={onClick}>
      {room.name}
    </li>
  )
}

const LoadingRooms = () => {
  return (
    <div>
      Carregando salas...
    </div>
  )
}

const ErrorRooms = ({ error }: { error: Error }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      color: 'red',
    }}>
      <div>
        Ocorreu um erro.
      </div>
      <div>
        {error.message}
      </div>
    </div>
  )
}

const EmptyRooms = () => {
  return (
    <div>
      Não há salas disponíveis
    </div>
  )
}