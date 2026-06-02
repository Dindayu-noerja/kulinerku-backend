import type { Express, Request, Response } from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { openApiSpec, swaggerHtml } from './swagger/openapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.getHttpAdapter();
  const server = httpAdapter.getInstance() as Express;

  server.get('/api-docs-json', (_request: Request, response: Response) => {
    response.json(openApiSpec);
  });

  server.get('/api-docs', (_request: Request, response: Response) => {
    response.type('html').send(swaggerHtml);
  });

  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}

void bootstrap();
