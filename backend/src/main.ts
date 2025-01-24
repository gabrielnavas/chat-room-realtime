import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { EntityNotFoundExceptionFilter } from './exception-filters/entity-not-found.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());

  // open and view doc swagge on browser: http://localhost:3000/api
  const options = new DocumentBuilder()
    .setTitle('Nest.js API Fullcycle')
    .setDescription('Documentação da API do Nest.js')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
