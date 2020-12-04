import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DataBaseModule } from './database/database.module';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './app.roles';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from 'nestjs-stripe';

@Module({
	imports: [
		DataBaseModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env.development',
		}),
		StripeModule.forRoot({
			apiKey: process.env.STRIPE_API_KEY,
			apiVersion: "2020-08-27",
		}),
		AccessControlModule.forRoles(roles),
		AuthModule,
		ApiModule,
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule { }
