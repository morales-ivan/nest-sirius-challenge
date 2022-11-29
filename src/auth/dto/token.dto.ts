import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccessToken {
	@IsString()
	@ApiProperty()
	access_token: string;

	constructor(token: string) {
		this.access_token = token;
	}
}
