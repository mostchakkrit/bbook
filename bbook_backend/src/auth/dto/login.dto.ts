import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'loseingThis@gmail.com' })
  @IsEmail()
  'email': string;
  @ApiProperty({ example: 'most123456' })
  @IsString()
  'password': string;
}
