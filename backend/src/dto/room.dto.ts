/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoomDto {
  @ApiProperty({
    type: String,
    description: 'Name of the room',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
