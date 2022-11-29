import { Email } from '../../email.model';
import { EmailHandler } from './provider.handler';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendgridHandler implements EmailHandler {
	providerName = 'Sendgrid';

	private readonly VERIFIED_SENDER: string;

	constructor(config: ConfigService) {
		sgMail.setApiKey(config.get('SENDGRID.API_KEY'));
		this.VERIFIED_SENDER = config.get('SENDGRID.VERIFIED_SENDER');
	}

	async send(email: Email): Promise<any> {
		// Overriding sender as this is a limitation of the free plan
		email.from = this.VERIFIED_SENDER;

		return await sgMail.send(email);
	}
}
