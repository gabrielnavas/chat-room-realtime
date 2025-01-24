import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponse } from 'src/api-doc/user.response';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get()
  async index(): Promise<User[]> {
    return this.userRepository.find();
  }

  @ApiOkResponse({
    type: UserResponse,
  })
  @Get(':id')
  show(@Param('id') id: string): Promise<User> {
    return this.userRepository.findOneByOrFail({
      id: +id,
    });
  }

  @ApiOkResponse({
    type: UserResponse,
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: User): Promise<User> {
    await this.userRepository.findOneByOrFail({
      id: +id,
    });
    await this.userRepository.update(
      {
        id: +id,
      },
      body,
    );
    return await this.userRepository.findOneByOrFail({
      id: +id,
    });
  }

  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(204)
  async destroy(@Param('id') id: string): Promise<void> {
    await this.userRepository.findOneByOrFail({
      id: +id,
    });
  }
}
