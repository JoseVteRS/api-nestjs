import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { initSwagger } from './app.swagger';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PORT } from './config/constants';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger('Bootstrap')
	const config = app.get(ConfigService)
	const port = parseInt(config.get<string>(PORT), 10) || 3000

	initSwagger(app)

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true
		})
	)

	await app.listen(port);
	logger.log(`Server running at ${await app.getUrl()}`)
}

bootstrap();
