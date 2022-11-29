import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { AppService } from '../app.service';
import { UserEditDto, UserStatsDto } from './dto';

@Injectable()
export class UserService extends AppService implements OnApplicationBootstrap {
	constructor(private prisma: PrismaService, private config: ConfigService) {
		super();
	}

	async onApplicationBootstrap(): Promise<void> {
		const adminEmail = this.config.get('APP.ADMIN.EMAIL');
		const hash = await argon.hash(this.config.get('APP.ADMIN.PASSWORD'));
		try {
			await this.prisma.user.upsert({
				where: { email: adminEmail },
				update: { hash: hash },
				create: {
					email: adminEmail,
					hash: hash,
					role: 'ADMIN',
					firstName: 'Ivan',
					lastName: 'The Admin',
				},
			});
			this.logger.log('Admin user successfully set up');
		} catch (error) {
			this.logger.error('Unexpected error creating admin user', error);
		}
	}

	async editUser(userId: string, dto: UserEditDto): Promise<User> {
		const user = await this.prisma.user.update({
			where: { id: userId },
			data: { ...dto },
		});

		delete user.hash;
		return user;
	}

	async getUsersStats(): Promise<UserStatsDto[]> {
		const startOfToday = this.atStartOfDay(new Date());

		return this.prisma.user.findMany({
			select: {
				id: true,
				email: true,
				role: true,
				usedQuota: true,
				lastMailDate: true,
			},
			where: {
				lastMailDate: { gt: startOfToday },
			},
		});
	}

	hasRemainingQuota(user: User): boolean {
		if (!user.lastMailDate) return true;
		return this.dateBeforeToday(user.lastMailDate) || user.usedQuota < 1000;
	}

	async updateQuota(user: User): Promise<void> {
		let newUsedQuota: number;
		if (user.lastMailDate && this.dateBeforeToday(user.lastMailDate)) newUsedQuota = 1;
		else newUsedQuota = user.usedQuota + 1;

		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				usedQuota: newUsedQuota,
				lastMailDate: new Date(),
			},
		});
	}

	dateBeforeToday(givenDate: Date): boolean {
		givenDate = this.atStartOfDay(givenDate);
		const today = this.atStartOfDay(new Date());

		return givenDate < today;
	}

	atStartOfDay(date: Date): Date {
		date.setHours(0, 0, 0, 0); // Setting time at start of day
		return date;
	}
}
