const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bearerToken = require('express-bearer-token');
const helmet = require('helmet');
const passport = require('passport');
const passportJwt = require('passport-jwt');

const config = require('./config');
const database = require('./database');
const routes = require('./routes');

const app = express();
const db = database.getDB();

passport.use(new passportJwt.Strategy({
	jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.SECRET_KEY,
}, (payload, done) => {
	const q = `
		SELECT
			user.id AS 'id',
			user.email AS 'email',
			role.name AS 'role'
		FROM user
		INNER JOIN ROLE ON user.role_id = role.id
		WHERE user.id = ?;`;
	const user = db.prepare(q).get(payload.sub);
	if (user) {
		return done(null, user);
	} else {
		return done(null, false);
	}
}));

app.use(morgan('dev'));
app.disable('x-powered-by');
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bearerToken());
app.use(passport.initialize());
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
app.use(`/api/${config.apiVersion}/users`, routes.songs);
app.use(`/api/${config.apiVersion}/auth`, routes.auth);
app.use(`/api/${config.apiVersion}`, routes.user);
app.get('*', (req, res, next) => {
	const err = new Error('URL Not Found');
	err.statusCode = 404;
	next(err);
});

// error handling middleware
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	console.error(err.message);
	if (!err.statusCode) {
		err.statusCode = 500; // set internal server error code if not already set
	}
	res.status(err.statusCode).json({
		error: err.message
	});
});

app.listen(config.PORT, () => {
	console.log(`Listening on port: ${config.PORT}`);
});
