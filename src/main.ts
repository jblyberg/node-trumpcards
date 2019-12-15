import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    const ip = process.env.IP || serverConfig.ip;
    const port = process.env.PORT || serverConfig.port;
    await app.listen(port, ip);
    logger.verbose(`Dev Mode: application listening on ${ip ? ip : '*'}:${port}`);
  }

  logger.log('Application is waiting for Trump to tweet.');
}
bootstrap();
