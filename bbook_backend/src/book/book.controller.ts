import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/current-user.decorator';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('book')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Post('')
  create(
    @Body() createBookDto: CreateBookDto,
    @CurrentUser() jwtPayloadDto: JwtPayloadDto,
  ) {
    return this.bookService.create(createBookDto, jwtPayloadDto);
  }

  @Get('')
  findAll(@CurrentUser() jwtPayloadDto: JwtPayloadDto) {
    return this.bookService.findAll(jwtPayloadDto.userId);
  }
  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findPending() {
    return this.bookService.findPending();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }

  @Patch('status/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBookStatusDto) {
    return this.bookService.updateStatus(id, dto.status);
  }
}
