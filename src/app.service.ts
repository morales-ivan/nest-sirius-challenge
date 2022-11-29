import { Logger } from '@nestjs/common';

export class AppService {
	protected readonly logger = new Logger(this.constructor.name);
}
