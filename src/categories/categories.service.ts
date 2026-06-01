import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany();
  }

  create(body: any) {
    return this.prisma.category.create({
      data: {
        name: body.name,
      },
    });
  }

  update(id: number, body: any) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: body.name,
      },
    });
  }

  delete(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}