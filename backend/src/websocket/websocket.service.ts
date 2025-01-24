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
import { JoinBody, roomSocketNames, SendMessageBody, User } from './types';
import { JoinRoomService } from './join-room.service';
import { SendMessageService } from './send-message.service';
import { DisconnectService } from './disconnect.service';
import { ConnectionService } from './connection.service';

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

  constructor(
    private websocketJoinRoom: JoinRoomService,
    private websocketSendMessage: SendMessageService,
    private websocketDisconnect: DisconnectService,
    private websocketConnect: ConnectionService,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    this.websocketConnect.handle(this.users, client);
  }

  handleDisconnect(client: Socket) {
    this.websocketDisconnect.handle(this.users, client);
  }

  @SubscribeMessage(roomSocketNames.join)
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinBody,
  ) {
    return this.websocketJoinRoom.handle(this.users, client, body);
  }

  @SubscribeMessage(roomSocketNames.sendMessage)
  sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: SendMessageBody,
  ) {
    return this.websocketSendMessage.handle(this.users, client, body);
  }
}
