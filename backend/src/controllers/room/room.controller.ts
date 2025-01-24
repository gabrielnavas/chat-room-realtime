import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomResponse } from 'src/api-doc/room.response';
import { RoomDto } from 'src/dto/room.dto';
import { Room } from 'src/entities/room.entity';
import { Repository } from 'typeorm';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('room')
export class RoomController {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  @ApiOkResponse({ type: RoomResponse })
  @Get()
  async index(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  @ApiOkResponse({ type: RoomResponse })
  @Get(':id')
  async show(@Param('id') id: string): Promise<Room> {
    return this.roomRepository.findOneByOrFail({
      id: +id,
    });
  }

  @ApiCreatedResponse({
    type: RoomResponse,
  })
  @Post()
  async store(@Body(new ValidationPipe()) roomDto: RoomDto): Promise<Room> {
    const room = this.roomRepository.create(roomDto);
    return this.roomRepository.save(room);
  }

  @ApiOkResponse({
    type: RoomResponse,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) roomDto: RoomDto,
  ): Promise<Room> {
    await this.roomRepository.findOneByOrFail({
      id: +id,
    });
    await this.roomRepository.update({ id: +id }, roomDto);
    return await this.roomRepository.findOneByOrFail({
      id: +id,
    });
  }

  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(204)
  async destroy(@Param('id') id: string): Promise<void> {
    await this.roomRepository.findOneByOrFail({
      id: +id,
    });
    await this.roomRepository.delete({
      id: +id,
    });
  }
}
