import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  'lineUserId': string;

  @ApiProperty({
    example: 'ryan',
  })
  @IsString()
  @IsNotEmpty()
  'firstName': string;

  @ApiProperty({
    example: 'matinez',
  })
  @IsString()
  @IsNotEmpty()
  'lastName': string;

  @ApiProperty({
    example: 'loseingThis@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  'email': string;

  @ApiProperty({
    example: 'most123456',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  'password': string;
}
