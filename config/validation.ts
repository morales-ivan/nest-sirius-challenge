import * as Joi from 'joi';

export const validationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('local', 'local-docker', 'dev', 'test', 'production'),

	APP_PORT: Joi.number().required(),

	// JWT config
	JWT_SECRET: Joi.string().required(),
	JWT_EXPIRES_IN: Joi.string().default('15m'),

	// Database config
	DATABASE_URL: Joi.string().required(),

	// Sendgrid variables
	SENDGRID_API_KEY: Joi.string().required(),
	SENDGRID_VERIFIED_SENDER: Joi.string().required(),

	// Mailgun variables
	MAILGUN_API_KEY: Joi.string().required(),
	MAILGUN_DOMAIN: Joi.string().required(),
	MAILGUN_VERIFIED_RECIPIENTS: Joi.string().required(),
});
