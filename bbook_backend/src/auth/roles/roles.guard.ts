import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayloadDto }>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('กรุณาเข้าสู่ระบบ');
    }
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้');
    }
    return true;
  }
}
