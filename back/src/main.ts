import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      origin: ["http://localhost:5173", "http://127.0.0.1:5500"]
    }
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use('/uploads/profile-pictures', express.static(path.join(process.cwd(), 'uploads', 'profile-pictures')));

  await app.listen(3000);
}
bootstrap();
