import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UI } from 'bull-board';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/jobs', UI);
  await app.listen(4558);
}
bootstrap();
