import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const port = app.get('ConfigService').get('app.port');
  await app.listen(port);
  logger.log(`order-alert-bot listening on port '${port}'...`);
}
bootstrap();
