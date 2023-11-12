import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger Configurations
  const config = new DocumentBuilder()
    .setTitle('Ahsan Project example')
    .setDescription('Ahsan Project ')
    .setVersion('1.0')
    // .addBearerAuth(
    //   {
    //     description: 'Default JWT Authorization',
    //     type: 'http',
    //     in: 'header',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //   },
    //   'access-token',
    // )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
