const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bearerToken = require('express-bearer-token');
const helmet = require('helmet');
const passport = require('passport');
const passportJwt = require('passport-jwt');

const config = require('./config');
const database = require('./database');
const api = require('./api');

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
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	if (err.name === 'UnauthorizedError') {
		res.status(401).json({
			message: 'Unauthorized'
		});
	}
});
app.use(`/api/${config.apiVersion}/users`, api.songs);
app.use(`/api/${config.apiVersion}/auth`, api.auth);
app.use(`/api/${config.apiVersion}`, api.user);

app.listen(config.PORT, () => {
	console.log(`Listening on port: ${config.PORT}`);
});
