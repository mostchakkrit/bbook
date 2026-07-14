import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';
import { IsString } from 'class-validator';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
