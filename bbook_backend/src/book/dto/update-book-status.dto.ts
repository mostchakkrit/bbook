import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateBookStatusDto {
  @IsNotEmpty()
  @IsIn(['APPROVED', 'REJECTED'])
  status: string;
}
