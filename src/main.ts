import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './CommonsModule/httpFilter/http-exception.filter';

async function bootstrap() {

  require('dotenv-flow').config();

  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);

  const options = new DocumentBuilder()
    .setTitle('@NewSchool/back')
    .setDescription('Backend para o projeto NewSchool')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter(configService));

  await app.listen(configService.get<number>('PORT') || 3000);
}

bootstrap();
