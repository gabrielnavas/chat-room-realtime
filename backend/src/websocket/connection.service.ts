import { Injectable } from '@nestjs/common';
import { User } from './types';
import { Socket } from 'socket.io';
import { User as UserEntity } from 'src/entities/user.entity';

@Injectable()
export class ConnectionService {
  handle(users: Map<string, User>, client: Socket) {
    console.log('handle connection', client.id);
    const newUser = {
      client: client,
      name: '',
      roomId: 0,
      userEntity: new UserEntity(),
    } as User;
    users.set(client.id, newUser);
  }
}
