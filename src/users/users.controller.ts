import { Controller, Get, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '../swagger/decorators';
import { arrayOf, errorResponseSchema, userSchema } from '../swagger/schemas';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Ambil semua pengguna role user',
    description: 'Hanya dapat diakses oleh admin yang sudah login.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar pengguna role user.',
    schema: arrayOf(userSchema),
  })
  @ApiResponse({
    status: 401,
    description: 'Token tidak dikirim atau tidak valid.',
    schema: errorResponseSchema,
  })
  @ApiResponse({
    status: 403,
    description: 'Hanya admin yang boleh mengakses endpoint ini.',
    schema: errorResponseSchema,
  })
  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Ambil semua pengguna role admin',
    description: 'Hanya dapat diakses oleh admin yang sudah login.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar pengguna role admin.',
    schema: arrayOf(userSchema),
  })
  @ApiResponse({
    status: 401,
    description: 'Token tidak dikirim atau tidak valid.',
    schema: errorResponseSchema,
  })
  @ApiResponse({
    status: 403,
    description: 'Hanya admin yang boleh mengakses endpoint ini.',
    schema: errorResponseSchema,
  })
  @UseGuards(JwtGuard, AdminGuard)
  @Get('admins')
  findAdmins() {
    return this.usersService.findAdmins();
  }
}
