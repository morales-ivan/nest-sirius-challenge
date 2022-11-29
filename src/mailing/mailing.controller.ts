import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiServiceUnavailableResponse, ApiTags, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { MailingService } from './mailing.service';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EmailDto } from './dto';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@ApiTags('mailing')
@Controller('mail')
export class MailingController {
	constructor(private mailingService: MailingService) {}

	@Post('send')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ description: 'Email sent' })
	@ApiTooManyRequestsResponse({ description: 'User reached maximum number of emails per day!' })
	@ApiServiceUnavailableResponse({ description: 'Try again later, none of our providers are available right now :(' })
	async sendEmail(@GetUser() user: User, @Body() mail: EmailDto): Promise<void> {
		await this.mailingService.sendEmail(user, mail);
	}
}
