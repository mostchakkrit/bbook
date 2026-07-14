import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LinkLineDto } from './dto/link-line.dto';
import { CurrentUser } from 'src/common/current-user.decorator';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('link-line')
  @UseGuards(AuthGuard('jwt'))
  linkLine(
    @Body() linkLinedto: LinkLineDto,
    @CurrentUser() jwtPayloadDto: JwtPayloadDto,
  ) {
    return this.userService.linkLine(jwtPayloadDto.userId, linkLinedto.idToken);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  findMe(@CurrentUser() jwtPayloadDto: JwtPayloadDto) {
    return this.userService.findOne(jwtPayloadDto.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
