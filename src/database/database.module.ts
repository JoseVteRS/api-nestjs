import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: () => ({
				uri: `${process.env.DATABASE_URL}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,

				useUnifiedTopology: true,
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
			}),
		}),
	],
})
export class DataBaseModule { }
// mongodb://localhost:27017/alba