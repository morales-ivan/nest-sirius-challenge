import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { EmailDto } from './dto';
import { UserService } from '../user/user.service';
import { ReachedQuotaException } from './exceptions/ReachedQuotaException';
import { Email } from './email.model';
import { DispatcherService } from './dispatcher/dispatcher.service';
import { AppService } from '../app.service';

@Injectable()
export class MailingService extends AppService {
	constructor(
		private config: ConfigService,
		private userService: UserService,
		private emailDispatcher: DispatcherService,
	) {
		super();
	}

	async sendEmail(sender: User, emailDto: EmailDto): Promise<void> {
		const userHasRemainingQuota: boolean = this.userService.hasRemainingQuota(sender);

		if (!userHasRemainingQuota) throw new ReachedQuotaException();
		else {
			try {
				const email = new Email(sender, emailDto);
				await this.emailDispatcher.send(email);
				await this.userService.updateQuota(sender);
			} catch (error) {
				this.logger.log('Error sending email: ' + error);
				throw error;
			}
		}
	}
}
