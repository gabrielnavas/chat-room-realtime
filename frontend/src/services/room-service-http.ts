import { Room } from "../entities/room"

type RoomHttpResponse = {
  id: number
  name: string
  createdAt: string
}

const url = `${import.meta.env.VITE_API_ENDPOINT}/room`

export async function findRooms(): Promise<Room[]> {
  const response = await fetch(url)
  if (response.status >= 400 && response.status <= 599) {
    throw new Error('rooms not found')
  }
  const rooms = await response.json()
  return rooms.map((room: RoomHttpResponse) => ({
    id: room.id,
    name: room.name,
    createdAt: new Date(room.createdAt),
  }) as Room)
}
