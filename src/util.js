const jwt = require('jsonwebtoken');
const passport = require('passport');

const config = require('./config');

/*
 * Authentication middleware
 */
exports.authRequired = passport.authenticate('jwt', {session: false});

/*
 * Sign data, return a promise that resolves to
 * the JWT
 */
exports.jwtSign = (data, opts) => {
	return new Promise((resolve, reject) => {
		jwt.sign(data, config.SECRET_KEY, opts, (err, token) => {
			if (err) {
				reject(err);
			}
			resolve(token);
		});
	});
};

/*
 * Require that a user has a certain role
 */
exports.role = (role) => (req, res, next) => {
	if (req.user.role === role) {
		next();
	} else {
		console.error(`User id: ${req.user.id} does not have role: ${role}`);
		res.status(403).end();
	}
};

/*
 * Express middleware for handling
 * async functions
 */
exports.asyncMiddleware = fn => {
	return (req, res, next) => {
		return Promise.resolve(fn(req, res, next))
			.catch(next);
	};
};
