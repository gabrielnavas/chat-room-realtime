import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { User as UserEntity } from '../entities/user.entity';
import {
  JoinBody,
  Message,
  MessageKind,
  roomSocketNames,
  SendMessageBody,
  User,
} from './types';
import { JoinRoom } from './join-room.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})
export class WebsocketService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  users = new Map<string, User>();

  constructor(private joinRoom: JoinRoom) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log('handle connection', client.id);
    const newUser = {
      client: client,
      name: '',
      roomId: 0,
      userEntity: new UserEntity(),
    } as User;
    this.users.set(client.id, newUser);
  }

  handleDisconnect(client: Socket) {
    const user = this.users.get(client.id);
    if (user) {
      console.log(user.name, ' da sala ', user.roomId, ' saiu');
      this.users.delete(client.id); // Remove o usuário
      const message = {
        id: crypto.randomUUID(),
        name: user.name,
        text: `${user.name} saiu da sala`,
        kind: MessageKind.Server,
      } as Message;
      client.broadcast.emit('receive-message', message);
    }
  }

  @SubscribeMessage(roomSocketNames.join)
  async join(@ConnectedSocket() client: Socket, @MessageBody() body: JoinBody) {
    return this.joinRoom.handle(this.users, client, body);
  }

  @SubscribeMessage(roomSocketNames.sendMessage)
  sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: SendMessageBody,
  ) {
    console.log(roomSocketNames.sendMessage, client.id);

    const user = this.users.get(client.id);
    if (!user) {
      return;
    }
    console.log(user.client.id, body.message);
    const message = {
      id: crypto.randomUUID(),
      name: user.name,
      text: body.message,
      kind: 'client',
    } as Message;
    client.emit(roomSocketNames.receiveMessage, message);
    client.broadcast
      .to(String(user.roomId))
      .emit(roomSocketNames.receiveMessage, message);
  }
}
