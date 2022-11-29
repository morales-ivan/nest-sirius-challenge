export const configuration = () => ({
	NODE_ENV: process.env.NODE_ENV,

	DATABASE: {
		URL: process.env.DATABASE_URL,
	},

	APP: {
		PORT: parseInt(process.env.APP_PORT, 10),
		ADMIN: {
			EMAIL: process.env.APP_ADMIN_EMAIL || 'default@mail.com',
			PASSWORD: process.env.APP_ADMIN_PASSWORD || 'default-pass',
		},
	},

	JWT: {
		SECRET: process.env.JWT_SECRET || 'super-secret-jwt-secret',
		EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
	},

	SENDGRID: {
		API_KEY: process.env.SENDGRID_API_KEY,
		VERIFIED_SENDER: process.env.SENDGRID_VERIFIED_SENDER,
	},

	MAILGUN: {
		API_KEY: process.env.MAILGUN_API_KEY,
		DOMAIN: process.env.MAILGUN_DOMAIN,
		VERIFIED_RECIPIENTS: process.env.VERIFIED_RECIPIENTS,
	},
});
