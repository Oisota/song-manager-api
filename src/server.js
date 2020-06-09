require('module-alias/register');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bearerToken = require('express-bearer-token');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('@/config');
const routes = require('@/routes');
const middleware = require('@/middleware');
const { envelope } = require('@/util');

const app = express();

app.disable('x-powered-by');
app.disable('etag');
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bearerToken());
app.use(morgan('dev'));
app.use(rateLimit({
	windowMs: 15 * 60 * 1000, // 15 min
	max: 500,
	message: envelope(null, {
		message: 'Too many requests, try again later',
	})
}));

// main app routes
app.use(`/api/${config.API_VERSION}/health-check`, routes.healthCheck);
app.use(`/api/${config.API_VERSION}/users`, routes.songs);
app.use(`/api/${config.API_VERSION}/auth`, routes.auth);
app.use(`/api/${config.API_VERSION}`, routes.user);

app.get('*', middleware.catchAllRoute);
app.use(middleware.errorHandler);

app.listen(config.PORT, () => {
	console.log(`Listening on port: ${config.PORT}`);
});
