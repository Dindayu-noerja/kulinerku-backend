import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '../swagger/decorators';
import {
  arrayOf,
  errorResponseSchema,
  foodRequestSchema,
  foodSchema,
  foodWithCategorySchema,
} from '../swagger/schemas';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FoodsService } from './foods.service';

@ApiTags('Foods')
@Controller('foods')
export class FoodsController {
  constructor(private foodsService: FoodsService) {}

  @ApiOperation({ summary: 'Ambil semua makanan' })
  @ApiResponse({
    status: 200,
    description: 'Daftar makanan beserta kategori.',
    schema: arrayOf(foodWithCategorySchema),
  })
  @Get()
  findAll() {
    return this.foodsService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buat makanan baru',
    description: 'Hanya dapat diakses oleh admin yang sudah login.',
  })
  @ApiBody({ schema: foodRequestSchema })
  @ApiResponse({
    status: 201,
    description: 'Makanan berhasil dibuat.',
    schema: foodSchema,
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
  @Post()
  create(@Body() body: any) {
    return this.foodsService.create(body);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update makanan',
    description: 'Hanya dapat diakses oleh admin yang sudah login.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID makanan yang akan diupdate.',
    schema: { type: 'integer', example: 1 },
  })
  @ApiBody({ schema: foodRequestSchema })
  @ApiResponse({
    status: 200,
    description: 'Makanan berhasil diupdate.',
    schema: foodSchema,
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
  @ApiResponse({
    status: 404,
    description: 'Makanan tidak ditemukan.',
    schema: errorResponseSchema,
  })
  @UseGuards(JwtGuard, AdminGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.foodsService.update(Number(id), body);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Hapus makanan',
    description: 'Hanya dapat diakses oleh admin yang sudah login.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID makanan yang akan dihapus.',
    schema: { type: 'integer', example: 1 },
  })
  @ApiResponse({
    status: 200,
    description: 'Makanan berhasil dihapus.',
    schema: foodSchema,
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
  @ApiResponse({
    status: 404,
    description: 'Makanan tidak ditemukan.',
    schema: errorResponseSchema,
  })
  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.foodsService.delete(Number(id));
  }
}
