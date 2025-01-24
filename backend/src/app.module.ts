import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsocketService } from './websocket/websocket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomController } from './controllers/room/room.controller';
import { User } from './entities/user.entity';
import { Room } from './entities/room.entity';
import { UserController } from './controllers/user/user.controller';
import { InitUsers } from './init-data/init-users';
import { InitRooms } from './init-data/init-rooms';
import { JoinRoom } from './websocket/join-room.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      migrations: [__dirname + '/migrations/*.{js,ts}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Room]),
  ],
  controllers: [RoomController, UserController],
  providers: [WebsocketService, InitUsers, InitRooms, JoinRoom],
})
export class AppModule {}
