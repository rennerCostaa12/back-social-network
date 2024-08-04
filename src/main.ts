import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';

async function bootstrap() {
  dotenvConfig();
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(3001);
}
bootstrap();
