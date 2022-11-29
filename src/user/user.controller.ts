import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guard/admin.guard';
import { UserEditDto, UserStatsDto } from './dto';

@UseGuards(JwtGuard)
@ApiTags('user')
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('me')
	@ApiOkResponse()
	getMe(@GetUser() user: User): User {
		return user;
	}

	@Patch('me')
	@ApiOkResponse()
	async editUser(@GetUser('id') userId: string, @Body() userDto: UserEditDto): Promise<User> {
		return await this.userService.editUser(userId, userDto);
	}

	@Get('stats')
	@UseGuards(AdminGuard)
	@ApiOkResponse({ type: [UserStatsDto] })
	async getUsersStats(): Promise<UserStatsDto[]> {
		return await this.userService.getUsersStats();
	}
}
