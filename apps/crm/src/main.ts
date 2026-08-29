import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS so frontend can call it
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
