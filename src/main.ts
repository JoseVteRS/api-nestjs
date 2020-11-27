import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { initSwagger } from './app.swagger';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PORT } from './config/constants';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as session from 'express-session';

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
	app.use(helmet());

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(session({
		secret: process.env.SESSION_KEY || 'algosupersecreto',
		resave: true,
		saveUninitialized: true,
		cookie: { secure: false, maxAge: process.env.COOKIE_MAX_AGE || 1000 * 60 * 60 * 24 * 30 }
	}));

	// app.use(csurf({ cookie: { key: '_csrf', sameSite: true } }));

	app.use(
		rateLimit({
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 100, // limit each IP to 100 requests per windowMs
		}),
	);


	await app.listen(port);
	logger.log(`Server running at ${await app.getUrl()}`)
}

bootstrap();
