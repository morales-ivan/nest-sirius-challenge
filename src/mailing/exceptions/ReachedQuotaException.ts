import { HttpException, HttpStatus } from '@nestjs/common';

export class ReachedQuotaException extends HttpException {
	constructor() {
		super('User reached the daily quota limit, try again tomorrow.', HttpStatus.TOO_MANY_REQUESTS);
	}
}
