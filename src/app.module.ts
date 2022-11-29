import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailingModule } from './mailing/mailing.module';
import { DispatcherModule } from './mailing/dispatcher/dispatcher.module';
import { configuration, validationSchema } from '../config';
import { AppController } from './app.controller';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `config/env/${process.env.NODE_ENV}.env`,
			expandVariables: true,
			validationSchema,
			load: [configuration],
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		MailingModule,
		DispatcherModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
