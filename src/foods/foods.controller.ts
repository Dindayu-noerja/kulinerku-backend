import {Controller,Get,Post,Put,Delete,Param,Body,} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FoodsService } from './foods.service';

@Controller('foods')
export class FoodsController {
  constructor(private foodsService: FoodsService) {}

  @Get()
  findAll() {
    return this.foodsService.findAll();
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  create(@Body() body: any) {
    return this.foodsService.create(body);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.foodsService.update(
      Number(id),
      body,
    );
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.foodsService.delete(
      Number(id),
    );
  }
}