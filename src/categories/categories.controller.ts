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
  categoryRequestSchema,
  categorySchema,
  errorResponseSchema,
} from '../swagger/schemas';
import { CategoriesService } from './categories.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Ambil semua kategori' })
  @ApiResponse({
    status: 200,
    description: 'Daftar kategori.',
    schema: arrayOf(categorySchema),
  })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buat kategori baru',
    description: 'Hanya dapat diakses oleh admin yang sudah login.',
  })
  @ApiBody({ schema: categoryRequestSchema })
  @ApiResponse({
    status: 201,
    description: 'Kategori berhasil dibuat.',
    schema: categorySchema,
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
    return this.categoriesService.create(body);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update kategori',
    description: 'Hanya dapat diakses oleh admin yang sudah login.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID kategori yang akan diupdate.',
    schema: { type: 'integer', example: 1 },
  })
  @ApiBody({ schema: categoryRequestSchema })
  @ApiResponse({
    status: 200,
    description: 'Kategori berhasil diupdate.',
    schema: categorySchema,
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
    description: 'Kategori tidak ditemukan.',
    schema: errorResponseSchema,
  })
  @UseGuards(JwtGuard, AdminGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.categoriesService.update(Number(id), body);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Hapus kategori',
    description: 'Hanya dapat diakses oleh admin yang sudah login.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID kategori yang akan dihapus.',
    schema: { type: 'integer', example: 1 },
  })
  @ApiResponse({
    status: 200,
    description: 'Kategori berhasil dihapus.',
    schema: categorySchema,
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
    description: 'Kategori tidak ditemukan.',
    schema: errorResponseSchema,
  })
  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoriesService.delete(Number(id));
  }
}
