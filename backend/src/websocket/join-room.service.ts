import { Injectable } from '@nestjs/common';
import { JoinBody, Message, MessageKind, roomSocketNames, User } from './types';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JoinRoomService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    // @InjectRepository(UserEntity)
    // private messageRepository: Repository<Message>,
  ) {}

  // TODO: refatorar essa função
  async handle(users: Map<string, User>, client: Socket, body: JoinBody) {
    console.log(roomSocketNames.join, client.id);

    // verifica se usuario existe
    let user = users.get(client.id);
    if (!user) {
      console.error('usuário não encontrado no join', body);
      client.emit(roomSocketNames.error, {
        message: 'usuário não encontrado no join',
      });
      return;
    }

    // verifica se os dados estão de acordo
    if (!body.name || body.roomId <= 0 || body.roomId >= Number.MAX_VALUE) {
      const message = 'dados invalidos no join';
      console.error(message, body);
      client.emit(roomSocketNames.error, {
        message: message,
      });
      return;
    }

    // atualiza o usuario
    const userEntity = await this.userRepository.findOneBy({
      name: body.name.trim(),
    });
    if (userEntity === null) {
      const message = 'usuário não encontrado no join';
      console.error(message, body);
      client.emit(roomSocketNames.error, {
        message: message,
      });
      return;
    }

    // gera um novo user
    user = {
      client: user.client,
      roomId: body.roomId,
      name: body.name,
      userEntity: userEntity,
    };

    // entra na sala correta
    await client.join(String(body.roomId));

    // atualizar o socket do usuario
    users.set(user.client.id, user);

    console.log('nome atualizado', body);

    // envia uma mensagem para todos
    const message = {
      id: crypto.randomUUID(),
      name: user.name,
      text: `${user.name} entrou na sala ${body.roomId}`,
      kind: MessageKind.Server,
    } as Message;
    client.emit(roomSocketNames.receiveMessage, message);
    client.broadcast
      .to(String(user.roomId))
      .emit(roomSocketNames.receiveMessage, message);
  }
}
