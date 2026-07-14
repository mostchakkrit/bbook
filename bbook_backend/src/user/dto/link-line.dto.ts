import { IsNotEmpty, IsString } from 'class-validator';

export class LinkLineDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
