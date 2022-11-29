import { Injectable } from '@nestjs/common';
import { EmailHandler, MailgunHandler, SendgridHandler } from './handlers';
import { Email } from '../email.model';
import { ServiceUnavailableException } from '../exceptions/ServiceUnavailableException';
import { AppService } from '../../app.service';

@Injectable()
export class DispatcherService extends AppService {
	private readonly emailHandlers: EmailHandler[];

	constructor(sendgridHandler: SendgridHandler, mailgunHandler: MailgunHandler) {
		super();
		this.emailHandlers = [sendgridHandler, mailgunHandler];
	}

	async send(email: Email): Promise<void> {
		let emailSent = false;

		for (const emailHandler of this.emailHandlers)
			try {
				await emailHandler.send(email);
				this.logger.log(`Email sent successfully with ` + emailHandler.providerName);
				emailSent = true;
				break;
			} catch (error) {
				this.logger.warn('Error sending email with ' + emailHandler.providerName);
				this.logger.warn(error);
			}

		if (!emailSent) {
			this.logger.error('Failure sending the email, none of the providers were successful');
			throw new ServiceUnavailableException();
		}
	}
}
