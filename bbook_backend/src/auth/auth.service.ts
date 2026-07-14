import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email: loginDto.email },
      include: { role: true },
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('email หรือ รหัสผ่านไม่ถูกต้อง');
    }
    const compared = await bcrypt.compare(loginDto.password, user.password);
    if (!compared) {
      throw new UnauthorizedException('email หรือ รหัสผ่านไม่ถูกต้อง');
    }

    const { accessToken, refreshToken } = await this.generateToken({
      ...user,
      role: user.role.name,
    });
    return {
      statusCode: 200,
      message: 'เข้าสู่ระบบเสร็จสิ้น',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refresh(reqRefreshToken: string) {
    let payload: JwtPayloadDto;
    try {
      payload = this.jwtService.verify(reqRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('refresh token ไม่ถูกต้องหรือหมดอายุ');
    }
    const tokenHash = crypto
      .createHash('sha256')
      .update(reqRefreshToken)
      .digest('hex');
    const stored = await this.prismaService.refreshToken.findFirst({
      where: { tokenHash, userId: payload.userId },
    });
    if (!stored) {
      throw new UnauthorizedException(
        'refresh token ไม่ถูกต้องหรือถูกใช้ไปแล้ว',
      );
    }
    await this.prismaService.refreshToken.delete({ where: { id: stored.id } });
    const user = await this.prismaService.user.findFirst({
      where: { id: payload.userId },
      include: { role: true },
    });
    if (!user) {
      throw new UnauthorizedException('ไม่พบผู้ใช้งาน');
    }
    const { accessToken, refreshToken } = await this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
    });
    return {
      statusCode: 200,
      message: 'refresh token เสร็จสิ้น',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async generateToken(user: {
    id: string;
    email: string;
    role: string;
  }) {
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.prismaService.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken: token, refreshToken };
  }

  async logout(reqRefreshToken: string) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(reqRefreshToken)
      .digest('hex');
    await this.prismaService.refreshToken.deleteMany({
      where: {
        tokenHash,
      },
    });
    return { statusCode: 200, message: 'logout successfully' };
  }
}
