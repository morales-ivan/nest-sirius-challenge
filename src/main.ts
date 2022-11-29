import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const logger = new Logger('Bootstrap');
	logger.log('Creating app in the ' + process.env.NODE_ENV + ' environment');
	const app = await NestFactory.create(AppModule);

	// Request validation configuration
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);

	// Swagger configuration
	const config = new DocumentBuilder()
		.setTitle('Nest Mailing')
		.setDescription('The Sirius Nest API challenge')
		.setVersion('1.0')
		.addTag('mailing')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

	// Global app prefix
	app.setGlobalPrefix('api');

	// Getting the port from the environment
	const port = app.get(ConfigService).get('APP.PORT');
	await app.listen(port);
	logger.log('Listening on port ' + port);
}

bootstrap();
