import { User } from '@prisma/client';
import { EmailDto } from './dto';

export class Email {
	to: string | string[];
	from: string;
	subject: string;
	text: string;
	html: string;

	constructor(sender: User, mailDto: EmailDto) {
		this.from = sender.email;
		this.to = mailDto.to;
		this.subject = mailDto.subject;
		this.text = mailDto.body;
		this.html = mailDto.html;
	}
}
