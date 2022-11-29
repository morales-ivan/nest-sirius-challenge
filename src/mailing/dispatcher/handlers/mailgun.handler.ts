import { Email } from '../../email.model';
import { EmailHandler } from './provider.handler';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { NodeMailgun } from 'ts-mailgun';

@Injectable()
export class MailgunHandler implements EmailHandler {
	providerName = 'Mailgun';
	private mailer: NodeMailgun;

	private readonly VERIFIED_RECIPIENTS: string[];

	constructor(config: ConfigService) {
		this.mailer = new NodeMailgun(config.get('MAILGUN.API_KEY'));
		this.mailer.domain = config.get('MAILGUN.DOMAIN');
		this.mailer.fromEmail = 'postmaster@' + config.get('MAILGUN.VERIFIED_SENDER');
		this.mailer.fromTitle = 'Sirius Nest Challenge';

		this.VERIFIED_RECIPIENTS = config.get('MAILGUN.VERIFIED_RECIPIENTS');

		this.mailer.init();
	}

	async send(email: Email): Promise<any> {
		return await this.mailer.send(this.VERIFIED_RECIPIENTS, email.subject, email.text);
	}
}
