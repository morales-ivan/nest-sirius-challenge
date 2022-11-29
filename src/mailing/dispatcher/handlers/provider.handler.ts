import { Email } from '../../email.model';

export interface EmailHandler {
	providerName: string;

	send(email: Email): Promise<any>;
}
