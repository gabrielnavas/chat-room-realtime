import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InitRooms implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async onApplicationBootstrap() {
    const names = ['Sala 01', 'Sala 02', 'Sala 03'];

    await Promise.all(
      names.map(async (name) => {
        console.info(`[ * ] - Verify room with name: ${name}`);

        const existingRoom = await this.roomRepository.findOneBy({ name });
        if (!existingRoom) {
          const newRoom = this.roomRepository.create({
            createdAt: new Date(),
            name,
          });
          await this.roomRepository.save(newRoom);
          console.log(`[ * ] - Sala ${name} criada com sucesso`);
        } else {
          console.log(`[ * ] - Sala ${name} já existe`);
        }
      }),
    );
  }
}
