import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceUnavailableException extends HttpException {
	constructor() {
		super(
			'None of our providers were successful sending the email, try again later',
			HttpStatus.SERVICE_UNAVAILABLE,
		);
	}
}
