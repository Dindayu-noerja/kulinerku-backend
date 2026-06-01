import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.food.findMany({
      include: {
        category: true,
      },
    });
  }

  create(body: any) {
    return this.prisma.food.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        categoryId: body.categoryId,
      },
    });
  }

  update(id: number, body: any) {
    return this.prisma.food.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        categoryId: body.categoryId,
      },
    });
  }

  delete(id: number) {
    return this.prisma.food.delete({
      where: { id },
    });
  }
}