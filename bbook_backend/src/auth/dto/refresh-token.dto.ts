import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'put refresh token here' })
  @IsNotEmpty()
  @IsString()
  'refreshToken': string;
}
