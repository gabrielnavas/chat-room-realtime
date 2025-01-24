import { Location } from "react-router"
import { Message } from "../entities/message"

export const addNewMessage = (messages: Message[], newMessage: Message) => {
  const alreadyExists = messages.some(m => m.id === newMessage.id)
  if (!alreadyExists) {
    return [...messages, { ...newMessage }]
  }
  return messages
}

type QueryParams = {
  roomId: number
  name: string
}

export const getQueryParams = (location: Location): QueryParams => {
  const query = new URLSearchParams(location.search);
  return {
    roomId: +(query.get("roomId") || 0),
    name: query.get("name") || '',
  };
}