import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8081',
      'http://10.176.133.139:8081',
      'http://192.168.1.153:8081',
      'exp://192.168.1.153:8081',
      'http://10.176.131.145',
      'exp://10.176.131.145',
    ],
  });
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();
