const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bearerToken = require('express-bearer-token');
const helmet = require('helmet');
const sequelize = require('sequelize');

const config = require('./config');
const routes = require('./routes');

const app = express();

app.use(morgan('dev'));
app.disable('x-powered-by');
app.disable('etag');
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bearerToken());
app.use(morgan('dev'));
app.use((req, res, next) => { // allow cors
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	if (req.method === 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});

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
// TODO move this to util.js module
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	if (err instanceof sequelize.ValidationError) {
		console.log(err.message);
		console.log(err.errors);
	} else {
		console.error(err.message);
	}
	res.status(err.statusCode || 500) // send internal server error code if not already set
		.json({
			data: null,
			error: {
				message: err.message || 'Internal Server Error', // set message if not already set
			},
		});
});

app.listen(config.PORT, () => {
	console.log(`Listening on port: ${config.PORT}`);
});
