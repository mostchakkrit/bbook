import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const role = await this.prismaService.role.findFirst({
      where: {
        name: 'employee',
      },
    });
    if (!role) {
      throw new InternalServerErrorException('ไม่พบ role เริ่มต้นในระบบ');
    }
    const existingEmail = await this.prismaService.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingEmail) {
      throw new BadRequestException('email ซ้ำในระบบ');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prismaService.user.create({
      data: { ...createUserDto, password: hashedPassword, roleId: role.id },
    });
    const { password: _password, ...result } = user;
    return {
      statusCode: 201,
      message: 'created user successfully',
      data: result,
    };
  }

  async linkLine(userId: string, idToken: string) {
    const params = new URLSearchParams();
    params.append('id_token', idToken);
    params.append('client_id', process.env.LINE_LOGIN_CHANNEL_ID!);

    const res = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!res.ok) {
      const errorBody: unknown = await res.json();
      console.error('LINE verify error:', errorBody);
      throw new UnauthorizedException('LINE token ไม่ถูกต้อง');
    }
    const verified = (await res.json()) as { sub: string };
    const lineUserId = verified.sub;

    const existing = await this.prismaService.user.findFirst({
      where: { lineUserId },
    });
    if (existing && existing.id !== userId) {
      throw new BadRequestException('บัญชี LINE นี้ถูกผูกกับผู้ใช้อื่นแล้ว');
    }

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: { lineUserId },
    });
    const { password: _password, ...result } = user;
    return { statusCode: 200, message: 'ผูกบัญชี LINE สำเร็จ', data: result };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้งาน');
    }
    const { password: _password, ...result } = user;
    return result;
  }

  update(id: string, _updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
