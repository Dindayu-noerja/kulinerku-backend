import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '../swagger/decorators';
import {
  arrayOf,
  createOrderRequestSchema,
  errorResponseSchema,
  orderWithDetailsAndUserSchema,
  orderWithDetailsSchema,
} from '../swagger/schemas';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserGuard } from '../auth/guards/user.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Ambil semua order',
    description: 'Dapat diakses oleh pengguna yang sudah login.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar order beserta detail dan user.',
    schema: arrayOf(orderWithDetailsAndUserSchema),
  })
  @ApiResponse({
    status: 401,
    description: 'Token tidak dikirim atau tidak valid.',
    schema: errorResponseSchema,
  })
  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buat order baru',
    description:
      'Hanya dapat diakses oleh pengguna role user yang sudah login.',
  })
  @ApiBody({ schema: createOrderRequestSchema })
  @ApiResponse({
    status: 201,
    description: 'Order berhasil dibuat.',
    schema: orderWithDetailsSchema,
  })
  @ApiResponse({
    status: 401,
    description: 'Token tidak dikirim atau tidak valid.',
    schema: errorResponseSchema,
  })
  @ApiResponse({
    status: 403,
    description: 'Hanya role user yang boleh membuat order.',
    schema: errorResponseSchema,
  })
  @ApiResponse({
    status: 404,
    description: 'Food pada salah satu item tidak ditemukan.',
    schema: errorResponseSchema,
  })
  @UseGuards(JwtGuard, UserGuard)
  @Post()
  create(@Body() body: any) {
    return this.ordersService.create(body);
  }
}
