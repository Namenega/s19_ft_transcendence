import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe} from '@nestjs/common';

async function bootstrap() {

  // create() method returns an application object
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // The object will listen/wait for Http requests on port 3001
  await app.listen(3001);
}
bootstrap();
