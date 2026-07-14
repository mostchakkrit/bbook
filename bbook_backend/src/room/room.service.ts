import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    return await this.prismaService.room.create({ data: createRoomDto });
  }

  async findAll() {
    return await this.prismaService.room.findMany();
  }

  async findOne(id: string) {
    const room = await this.prismaService.room.findUnique({ where: { id } });
    if (!room) {
      throw new NotFoundException('ไม่พบห้องประชุม');
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    return await this.prismaService.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.room.delete({ where: { id } });
  }
}
