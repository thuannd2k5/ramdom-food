import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS cho phép mobile app và web truy cập
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Pipes & Filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Random Food API')
    .setDescription('Tài liệu API cho ứng dụng Random Food (Expo Mobile + NestJS + MongoDB Atlas)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Lắng nghe trên tất cả network interfaces (0.0.0.0) để điện thoại cùng mạng Wi-Fi truy cập được
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Máy chủ Backend đang chạy tại: http://localhost:${port}/api/v1`);
  logger.log(`📚 Swagger API Docs: http://localhost:${port}/api/docs`);
  logger.log(`❤️  Health Check API: http://localhost:${port}/api/v1/health`);
}
bootstrap();
