import { Socket } from 'socket.io';
import { User as UserEntity } from 'src/entities/user.entity';

export type SendMessageBody = {
  message: string;
};

export type JoinBody = {
  name: string;
  roomId: number;
};

export type User = {
  client: Socket;
  userEntity: UserEntity;
  name: string;
  roomId: number;
};

export enum MessageKind {
  Client = 'client',
  Server = 'server',
}

export type Message = {
  id: string;
  text: string;
  name: string;
  kind: MessageKind;
};

export const roomSocketNames = {
  join: 'join',
  sendMessage: 'send-message',
  receiveMessage: 'receive-message',
  error: 'error',
};
