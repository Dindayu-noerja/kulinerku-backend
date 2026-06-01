import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserGuard } from '../auth/guards/user.guard';

@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtGuard, UserGuard)
  @Post()
  create(@Body() body: any) {
    return this.ordersService.create(body);
  }
}