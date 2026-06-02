import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '../swagger/decorators';
import {
  errorResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  registerRequestSchema,
  userWithPasswordSchema,
} from '../swagger/schemas';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Register pengguna baru',
    description: 'Mendaftarkan pengguna baru dengan role default user.',
  })
  @ApiBody({ schema: registerRequestSchema })
  @ApiResponse({
    status: 201,
    description: 'User berhasil dibuat.',
    schema: userWithPasswordSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Email sudah digunakan atau request tidak valid.',
    schema: errorResponseSchema,
  })
  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @ApiOperation({
    summary: 'Login pengguna',
    description:
      'Menghasilkan JWT access token untuk autentikasi endpoint yang diproteksi.',
  })
  @ApiBody({ schema: loginRequestSchema })
  @ApiResponse({
    status: 201,
    description: 'Login berhasil.',
    schema: loginResponseSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'User tidak ditemukan atau password salah.',
    schema: errorResponseSchema,
  })
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}
