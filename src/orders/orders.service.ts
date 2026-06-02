import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(body: any) {
    let total = 0;

    const items: any[] = [];

    for (const item of body.items) {
      const food = await this.prisma.food.findUnique({
        where: {
          id: item.foodId,
        },
      });

      if (!food) {
        throw new NotFoundException(
          `Food dengan ID ${item.foodId} tidak ditemukan`,
        );
      }

      const subtotal = food.price * item.qty;

      total += subtotal;

      items.push({
        foodId: food.id,
        qty: item.qty,
        price: food.price,
        subtotal,
      });
    }

    return this.prisma.order.create({
      data: {
        userId: body.userId,
        totalPrice: total,
        orderdetail: {
          create: items,
        },
      },
      include: {
        orderdetail: true,
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        orderdetail: true,
        user: true,
      },
    });
  }
}