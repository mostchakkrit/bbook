import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { LineModule } from 'src/line/line.module';

@Module({
  imports: [LineModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
