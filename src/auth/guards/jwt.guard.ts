import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
  const request = context.switchToHttp().getRequest();

  console.log('HEADERS =', request.headers);

  const authHeader =
    request.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedException();
  }

  const token = authHeader.split(' ')[1];

  console.log('TOKEN =', token);

  try {
    const payload =
      this.jwtService.verify(token, {
        secret: 'kulinerku-secret',
      });

    console.log('PAYLOAD =', payload);

    request.user = payload;

    return true;
  } catch (error) {
    console.log('JWT ERROR =', error);

    throw new UnauthorizedException();
  }
}}