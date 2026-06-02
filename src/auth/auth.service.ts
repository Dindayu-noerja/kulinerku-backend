import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(body: any) {
    const userExist = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (userExist) {
      throw new BadRequestException('Email sudah digunakan');
    }

    const hashed = await bcrypt.hash(body.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashed,
      },
    });

    return user;
  }


  async login(body: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new BadRequestException('User tidak ditemukan');
    }

    const valid = await bcrypt.compare(
      body.password,
      user.password,
    );

    if (!valid) {
      throw new BadRequestException('Password salah');
    }

    const token = this.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
    };
  }
}