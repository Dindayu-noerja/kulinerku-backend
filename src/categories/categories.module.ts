import { Module } from '@nestjs/common';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // tambah ini
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}