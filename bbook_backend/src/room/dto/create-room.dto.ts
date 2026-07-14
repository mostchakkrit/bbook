import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    example: 'Meeting Room 1',
  })
  @IsString()
  @IsNotEmpty()
  'name': string;

  @ApiProperty({
    example: '1',
  })
  @IsInt()
  @Min(1)
  'capacity': number;

  @ApiProperty({
    example: 'Floor 1',
  })
  @IsString()
  @IsNotEmpty()
  'location': string;

  @ApiProperty({
    example: ['projector', 'whiteboard'],
  })
  @IsArray()
  'amenities': string[];
}
