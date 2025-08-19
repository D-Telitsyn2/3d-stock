import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 API server running on http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('Failed to start API server:', err);
  process.exit(1);
});
