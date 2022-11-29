import { Module } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';
import { MailgunHandler, SendgridHandler } from './handlers';

@Module({
	providers: [DispatcherService, SendgridHandler, MailgunHandler],
	exports: [DispatcherService],
})
export class DispatcherModule {}
