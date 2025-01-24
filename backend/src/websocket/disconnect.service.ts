import { Injectable } from '@nestjs/common';
import { Message, MessageKind, User } from './types';

import { Socket } from 'socket.io';

@Injectable()
export class DisconnectService {
  handle(users: Map<string, User>, client: Socket) {
    const user = users.get(client.id);
    if (user) {
      console.log(user.name, ' da sala ', user.roomId, ' saiu');
      users.delete(client.id); // Remove o usuário
      const message = {
        id: crypto.randomUUID(),
        name: user.name,
        text: `${user.name} saiu da sala`,
        kind: MessageKind.Server,
      } as Message;
      client.broadcast.emit('receive-message', message);
    }
  }
}
