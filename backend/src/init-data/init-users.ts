import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InitUsers implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const names = ['admin1', 'admin2'];

    await Promise.all(
      names.map(async (name) => {
        console.info(`[ * ] - Verify user with name: ${name}`);

        const existingUser = await this.userRepository.findOneBy({ name });
        if (!existingUser) {
          const newUser = this.userRepository.create({
            email: `${name}@email.com`,
            createdAt: new Date(),
            messages: [],
            name,
          });
          await this.userRepository.save(newUser);
          console.log(`[ * ] - Usuário ${name} criado com sucesso`);
        } else {
          console.log(`[ * ] - Usuário ${name} já existe`);
        }
      }),
    );
  }
}
