import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
	canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = ctx.switchToHttp().getRequest();
		return this.validateRequest(request);
	}

	validateRequest(request): boolean {
		return request.user.role === Role.ADMIN;
	}
}
