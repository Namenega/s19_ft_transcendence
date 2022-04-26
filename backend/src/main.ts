import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // create application
  const app = await NestFactory.create(AppModule);

  //launch on port 3000
  await app.listen(3000);
}
bootstrap();
