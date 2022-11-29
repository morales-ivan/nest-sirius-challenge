import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { DispatcherModule } from './dispatcher/dispatcher.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [DispatcherModule, UserModule],
	controllers: [MailingController],
	providers: [MailingService],
	exports: [MailingService],
})
export class MailingModule {}
