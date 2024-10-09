import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`=== Nest listen on port: ${port} ===`);
}

bootstrap();
