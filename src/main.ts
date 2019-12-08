import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  require('dotenv-flow').config();

  const appOptions = {cors: true};
  const app = await NestFactory.create(AppModule, appOptions);

  const options = new DocumentBuilder()
    .setTitle('@NewSchool/back')
    .setDescription('Backend para o projeto NewSchool')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
