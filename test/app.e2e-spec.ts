import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { ConfigService } from '@nestjs/config';
import { AppController } from '../src/app.controller';

describe('E2E Testing', () => {
	let app: INestApplication;
	const adminCredentials = new AuthDto();

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
			controllers: [AppController],
		}).compile();

		app = moduleRef.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
			}),
		);

		const appConfig = app.get(ConfigService);
		const port = appConfig.get('APP.PORT');
		adminCredentials.email = appConfig.get('APP.ADMIN.EMAIL');
		adminCredentials.password = appConfig.get('APP.ADMIN.PASSWORD');

		app.setGlobalPrefix('api');

		const prisma = app.get(PrismaService);
		await prisma.cleanDb();

		await app.init();
		await app.listen(port);

		pactum.request.setBaseUrl(`http://localhost:${port}/api`);
	});

	afterAll(async () => {
		await app.close();
	});

	describe('App', () => {
		describe('Health Check', () => {
			it('should return 200', () => {
				return pactum.spec().get('/app/health-check').expectStatus(200);
			});
		});
	});

	describe('Auth', () => {
		const dto: AuthDto = {
			email: 'ivan@test.com',
			password: 'testing-password',
		};

		describe('Signup', () => {
			it('should throw when email empty', () => {
				return pactum.spec().post('/auth/sign-up').withBody(dto.password).expectStatus(400);
			});

			it('should throw when password empty', () => {
				return pactum.spec().post('/auth/sign-up').withBody(dto.email).expectStatus(400);
			});

			it('should throw when body empty', () => {
				return pactum.spec().post('/auth/sign-up').expectStatus(400);
			});

			it('should throw when invalid email', () => {
				return pactum
					.spec()
					.post('/auth/sign-up')
					.withBody({
						email: 'invalid-email@',
						password: dto.password,
					})
					.expectStatus(400);
			});

			it('should signup', () => {
				return pactum
					.spec()
					.post('/auth/sign-up')
					.withBody(dto)
					.expectStatus(201)
					.expectBodyContains('access_token');
			});

			it('should throw when taken credentials', () => {
				return pactum.spec().post('/auth/sign-up').withBody(dto).expectStatus(403);
			});
		});

		describe('Signin', () => {
			it('should throw when email empty', () => {
				return pactum.spec().post('/auth/sign-in').withBody(dto.password).expectStatus(400);
			});

			it('should throw when password empty', () => {
				return pactum.spec().post('/auth/sign-in').withBody(dto.email).expectStatus(400);
			});

			it('should throw when body empty', () => {
				return pactum.spec().post('/auth/sign-in').expectStatus(400);
			});

			it('should throw when invalid credentials', () => {
				return pactum
					.spec()
					.post('/auth/sign-in')
					.withBody({
						email: dto.email,
						password: 'invalid-password',
					})
					.expectStatus(403);
			});

			it('should throw when user not found', () => {
				return pactum
					.spec()
					.post('/auth/sign-in')
					.withBody({
						email: 'new.user@mail.com',
						password: dto.password,
					})
					.expectStatus(404);
			});

			it('should signin', () => {
				return pactum
					.spec()
					.post('/auth/sign-in')
					.withBody(dto)
					.expectStatus(200)
					.expectBodyContains('access_token')
					.stores('user_token', 'access_token');
			});

			it('should signin with admin credentials', () => {
				return pactum
					.spec()
					.post('/auth/sign-in')
					.withBody(adminCredentials)
					.expectStatus(200)
					.expectBodyContains('access_token')
					.stores('admin_token', 'access_token')
					.inspect();
			});
		});
	});

	describe('Users', () => {
		describe('Get me', () => {
			it('should throw when not authenticated', () => {
				return pactum.spec().get('/users/me').expectStatus(401);
			});

			it('should get me', () => {
				return pactum
					.spec()
					.get('/users/me')
					.withHeaders({ Authorization: 'Bearer $S{user_token}' })
					.expectStatus(200);
			});
		});

		describe('Edit user', () => {
			it('should throw when invalid email', () => {
				const dto = {
					firstName: 'Ivan',
					lastName: 'Queen',
					email: 'invalid-email@',
				};

				return pactum
					.spec()
					.patch('/users/me')
					.withHeaders({ Authorization: 'Bearer $S{user_token}' })
					.withBody(dto)
					.expectStatus(400);
			});

			it('should edit user', () => {
				const dto = {
					firstName: 'Ivan',
					lastName: 'Queen',
				};

				return pactum
					.spec()
					.patch('/users/me')
					.withHeaders({ Authorization: 'Bearer $S{user_token}' })
					.withBody(dto)
					.expectStatus(200)
					.expectBodyContains(dto.firstName)
					.expectBodyContains(dto.lastName);
			});
		});

		describe('Check users', () => {
			it('should throw when user not admin', () => {
				return pactum
					.spec()
					.get('/users/stats')
					.withHeaders({ Authorization: 'Bearer $S{user_token}' })
					.expectStatus(403);
			});

			it('should check users stats', () => {
				return pactum
					.spec()
					.get('/users/stats')
					.withHeaders({ Authorization: 'Bearer $S{admin_token}' })
					.expectStatus(200)
					.expectJsonLength(0);
			});
		});
	});
});
