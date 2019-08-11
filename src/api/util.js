const jwt = require('jsonwebtoken');

const config = require('../config');

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
		res.status(403).end();
	}
};

exports.asyncMiddleware = fn => {
	return (req, res, next) => {
		return Promise.resolve(fn(req, res, next))
			.catch(next);
	};
};
