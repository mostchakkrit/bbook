import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'put refresh token here' })
  @IsNotEmpty()
  @IsString()
  'refreshToken': string;
}
