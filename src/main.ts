import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import * as Sentry from '@sentry/node';
import { RavenInterceptor } from 'nest-raven';
import { json, urlencoded } from 'express';
import { HttpExceptionFilter } from './CommonsModule/httpFilter/http-exception.filter';
import { AppConfigService as ConfigService } from './ConfigModule/service/app-config.service';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();

  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);

  const options = new DocumentBuilder()
    .setTitle('@NewSchool/back')
    .setDescription('Backend para o projeto NewSchool')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(process.env.IS_GITPOD ? '' : 'swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const appConfigService = app.get<ConfigService>(ConfigService);

  app.useGlobalInterceptors(new RavenInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  Sentry.init(appConfigService.getSentryConfiguration());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(appConfigService.port || 8080);
}

bootstrap();
