import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * Create an application, enable pipes globally, and launch on port 3000.
 */
async function bootstrap() {
  // create application
  const app = await NestFactory.create(AppModule);

  // enables pipes globally
  app.useGlobalPipes(new ValidationPipe());

  // launch on port 3000
  await app.listen(3000);
}
bootstrap();
