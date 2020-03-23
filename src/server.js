const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bearerToken = require('express-bearer-token');
const helmet = require('helmet');
const sequelize = require('sequelize');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const routes = require('./routes');
const { envelope } = require('./envelope');

const app = express();

app.use(morgan('dev'));
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
app.use(`/api/${config.apiVersion}/users`, routes.songs);
app.use(`/api/${config.apiVersion}/auth`, routes.auth);
app.use(`/api/${config.apiVersion}`, routes.user);

// catch all handler
app.get('*', (req, res, next) => {
	const err = new Error('URL Not Found');
	err.statusCode = 404;
	next(err);
});

// error handling middleware
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	if (err instanceof sequelize.ValidationError) {
		console.log(err);
		console.log(err.message);
		console.log(err.errors);
	} else {
		console.error(err.message);
	}
	res.status(err.statusCode || 500) // send internal server error code if not already set
		.json(envelope(null, {
			message: err.message || 'Internal Server Error', // set message if not already set
		}));
});

app.listen(config.PORT, () => {
	console.log(`Listening on port: ${config.PORT}`);
});
