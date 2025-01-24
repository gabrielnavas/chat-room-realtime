import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import {
  Message,
  MessageKind,
  roomSocketNames,
  SendMessageBody,
  User,
} from './types';

@Injectable()
export class SendMessageService {
  constructor() {}

  handle(users: Map<string, User>, client: Socket, body: SendMessageBody) {
    console.log(roomSocketNames.sendMessage, client.id);

    const user = users.get(client.id);
    if (!user) {
      return;
    }
    console.log(user.client.id, body.message);
    const message = {
      id: crypto.randomUUID(),
      name: user.name,
      text: body.message,
      kind: MessageKind.Client,
    } as Message;

    client.emit(roomSocketNames.receiveMessage, message);
    client.broadcast
      .to(String(user.roomId))
      .emit(roomSocketNames.receiveMessage, message);
  }
}
