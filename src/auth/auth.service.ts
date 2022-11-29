import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AccessToken, AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
	private readonly JWT_SECRET: string;

	constructor(config: ConfigService, private jwt: JwtService, private prisma: PrismaService) {
		this.JWT_SECRET = config.get('JWT.SECRET');
	}

	async signUp(authDto: AuthDto) {
		// Generate hash pass
		const hash = await argon.hash(authDto.password);

		try {
			// Save the new user
			const user = await this.prisma.user.create({
				data: {
					email: authDto.email,
					hash,
				},
			});

			const token = await this.signToken(user.id, user.email);

			// Send back the access_token
			return new AccessToken(token);
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					// Handle unique constraint violation
					throw new ForbiddenException('Credentials taken');
				}
			}
			throw error;
		}
	}

	async signIn(authDto: AuthDto): Promise<AccessToken> {
		// Find user by email
		// If user does not exist throw exception
		const user = await this.prisma.user.findUnique({
			where: {
				email: authDto.email,
			},
		});

		if (!user) throw new NotFoundException('User not found');

		// Check if password is correct
		// If password is incorrect throw exception
		const passwordMatches = await argon.verify(user.hash, authDto.password);

		if (!passwordMatches) throw new ForbiddenException('Invalid credentials');

		const signedToken = await this.signToken(user.id, user.email);

		// Send back the access_token
		return new AccessToken(signedToken);
	}

	async signToken(userId: string, email: string): Promise<string> {
		const payload = {
			sub: userId,
			email,
		};

		return await this.jwt.signAsync(payload, {
			expiresIn: '1h',
			secret: this.JWT_SECRET,
		});
	}
}
