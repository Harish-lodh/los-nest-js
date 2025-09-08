import dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import 'reflect-metadata';

import { join } from 'path';
async function bootstrap() {
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // credentials: true,
  });
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
