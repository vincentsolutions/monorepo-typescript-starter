import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const options = new DocumentBuilder()
      .setTitle('Monorepo API')
      .setDescription('Monorepo API Description')
      .setVersion('1.0')
      .addTag('users')
      .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(4551);
}
bootstrap();
