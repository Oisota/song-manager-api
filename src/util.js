const jwt = require('jsonwebtoken');

const config = require('@/config');

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
 * Verify a jwt
 */
exports.jwtVerify = (token, opts) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.SECRET_KEY, opts, (err, payload) => {
			if (err) {
				reject(err);
			}
			resolve(payload);
		});
	});
};
