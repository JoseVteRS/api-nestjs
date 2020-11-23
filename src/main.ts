import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { initSwagger } from './app.swagger';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PORT } from './config/constants';
import * as cors from 'cors';

const whitelist = ['https://nevook.com', 'http://localhost:3001']
const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}

async function bootstrap() {

	if (process.env.NODE_ENV === 'production') {
		cors(corsOptions);
	}
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
