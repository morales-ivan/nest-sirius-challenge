import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmailDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	to: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	subject: string;

	@IsString()
	@ApiPropertyOptional()
	body?: string;

	@IsString()
	@ApiPropertyOptional()
	html?: string;
}
