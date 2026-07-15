import { IsIn, IsNotEmpty } from 'class-validator';
import { BookingStatus } from 'generated/prisma/client';

export class UpdateBookStatusDto {
  @IsNotEmpty()
  @IsIn([BookingStatus.APPROVED, BookingStatus.REJECTED])
  status: 'APPROVED' | 'REJECTED';
}
