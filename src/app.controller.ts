import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

@ApiTags('app')
@Controller('app')
export class AppController {
	@Get('health-check')
	@ApiOkResponse()
	checkHealth(): void {}
}
