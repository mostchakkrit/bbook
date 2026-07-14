import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'cmrau38zg0000mcu27uuztgnj',
  })
  'roomId': string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-07-10T14:00:00.000Z',
  })
  'startTime': string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-07-10T15:00:00.000Z',
  })
  'endTime': string;
}
