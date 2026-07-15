import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { BookingStatus } from 'generated/prisma/client';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { LineService } from 'src/line/line.service';

@Injectable()
export class BookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly lineService: LineService,
  ) {}

  async create(createBookDto: CreateBookDto, jwtPayloadDto: JwtPayloadDto) {
    if (createBookDto.endTime < createBookDto.startTime) {
      throw new BadRequestException('กรุณาส่งวันเวลาให้ถูกต้อง');
    }
    if (new Date(createBookDto.startTime) < new Date()) {
      throw new BadRequestException('ไม่สามารถจองเวลาที่ผ่านไปแล้วได้');
    }
    const conflict = await this.prismaService.book.findFirst({
      where: {
        roomId: createBookDto.roomId,
        startTime: { lt: createBookDto.endTime },
        endTime: { gt: createBookDto.startTime },
      },
    });
    if (conflict) {
      throw new ConflictException('ห้องนี้ถูกจองในช่วงเวลานี้แล้ว');
    }
    const book = await this.prismaService.book.create({
      data: {
        ...createBookDto,
        userId: jwtPayloadDto.userId,
      },
    });
    return {
      statusCode: 201,
      message: 'Create book successfully',
      data: book,
    };
  }

  async findAll(userId: string) {
    const books = await this.prismaService.book.findMany({
      where: { userId },
      orderBy: { startTime: 'asc' },
      include: { room: true },
    });
    return {
      statusCode: 200,
      message: 'findAll book successfully',
      data: books,
    };
  }

  async findOne(id: string) {
    const book = await this.prismaService.book.findFirst({ where: { id } });
    if (!book) {
      throw new NotFoundException('ไม่พบข้อมูล');
    }
    return {
      statusCode: 200,
      message: 'find book successfully',
      data: book,
    };
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const existing = await this.prismaService.book.findFirst({ where: { id } });
    if (!existing) {
      throw new NotFoundException('ไม่พบข้อมูล');
    }
    const startTime = new Date(updateBookDto.startTime ?? existing.startTime);
    const endTime = new Date(updateBookDto.endTime ?? existing.endTime);
    if (new Date(startTime) < new Date()) {
      throw new BadRequestException('ไม่สามารถจองเวลาที่ผ่านไปแล้วได้');
    }
    if (endTime < startTime) {
      throw new BadRequestException('กรุณาส่งวันเวลาให้ถูกต้อง');
    }
    const conflict = await this.prismaService.book.findFirst({
      where: {
        id: { not: id },
        roomId: updateBookDto.roomId ?? existing.roomId,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
    if (conflict) {
      throw new ConflictException('ห้องนี้ถูกจองในช่วงเวลานี้แล้ว');
    }
    const res = await this.prismaService.book.update({
      where: { id },
      data: updateBookDto,
    });
    if (!res) {
      throw new NotFoundException('ไม่พบข้อมูล');
    }

    return {
      statusCode: 200,
      message: 'updated book successfully',
      data: res,
    };
  }

  async remove(id: string) {
    const res = await this.prismaService.book.delete({ where: { id } });
    if (!res) {
      throw new NotFoundException('ไม่พบข้อมูล');
    }
    return {
      statusCode: 200,
      message: 'deleted book successfully',
      data: res,
    };
  }

  async findPending() {
    const books = await this.prismaService.book.findMany({
      where: { status: 'PENDING' },
      orderBy: { startTime: 'asc' },
      include: {
        room: true,
        user: {
          omit: { password: true, lineUserId: true },
        },
      },
    });
    return {
      statusCode: 200,
      message: 'findPending book successfully',
      data: books,
    };
  }

  async updateStatus(id: string, status: BookingStatus) {
    const existing = await this.prismaService.book.findFirst({ where: { id } });
    if (!existing) {
      throw new NotFoundException('ไม่พบข้อมูล');
    }
    const res = await this.prismaService.book.update({
      where: { id },
      data: { status },
      include: {
        room: true,
        user: { omit: { password: true } },
      },
    });

    if (res.user.lineUserId) {
      const statusText = status === 'APPROVED' ? 'อนุมัติ ✅' : 'ปฏิเสธ ❌';
      const message = `การจอง "${res.room.name}" วันที่ ${res.startTime.toLocaleString('th-TH')} ถูก${statusText}แล้วครับ`;
      await this.lineService.pushMessage(res.user.lineUserId, message);
    }

    return {
      statusCode: 200,
      message: 'updated status successfully',
      data: res,
    };
  }
}
