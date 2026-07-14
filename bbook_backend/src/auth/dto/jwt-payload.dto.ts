import { IsEmail, IsString } from 'class-validator';

export class JwtPayloadDto {
  @IsString()
  'userId': string;
  @IsEmail()
  'email': string;
  @IsString()
  'role': string;
}
