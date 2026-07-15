import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { RoomModule } from './room/room.module';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LineModule } from './line/line.module';

@Module({
  imports: [
    PrismaModule,
    RoomModule,
    BookModule,
    UserModule,
    AuthModule,
    LineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
