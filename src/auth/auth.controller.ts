import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessToken, AuthDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('sign-up')
	@ApiCreatedResponse({ type: AccessToken })
	signUp(@Body() authDto: AuthDto) {
		return this.authService.signUp(authDto);
	}

	@Post('sign-in')
	@HttpCode(HttpStatus.OK)
	@ApiOkResponse({ type: AccessToken })
	signIn(@Body() authDto: AuthDto) {
		return this.authService.signIn(authDto);
	}
}
