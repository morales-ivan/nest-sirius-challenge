import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsDate, IsEmail, IsEnum } from 'class-validator';

export class UserStatsDto {
	@ApiProperty()
	id: string;

	@IsEmail()
	@ApiProperty()
	email: string;

	@IsEnum(Role)
	@ApiProperty()
	role: Role;

	@ApiProperty()
	usedQuota: number;

	@IsDate()
	@ApiProperty()
	lastMailDate: Date;
}
