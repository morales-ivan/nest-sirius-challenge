import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserEditDto {
	@ApiProperty()
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	firstName?: string;

	@ApiProperty()
	@IsString()
	@IsOptional()
	lastName?: string;
}
