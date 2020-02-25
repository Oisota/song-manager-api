const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const config = require('./config');
const database = require('./database');

const db = database.getDB();

/*
 * Verify a jwt
 */
function jwtVerify (token, opts) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.SECRET_KEY, opts, (err, payload) => {
			if (err) {
				reject(err);
			}
			resolve(payload);
		});
	});
}

/*
 * Authentication middleware
 */
exports.authRequired = asyncHandler(async (req, res, next) => {
	let payload = null;
	try {
		payload = await jwtVerify(req.token, {});
	} catch (err) {
		console.log(err);
		const newError = new Error('Unauthorized');
		newError.statusCode = 401;
		throw newError;
	}
	/*
	 * TODO Use services here to get user info
	 */
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
		req.user = user;
		return next();
	}
	const err = new Error('Unauthorized');
	err.statusCode = 401;
	throw err;
});

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
 * Validation Middleware using superstruct
 */
exports.validate = (schema) => {
	return (req, res, next) => {
		const [error] = schema.validate(req.body);
		if (error) {
			error.statusCode = 500;
			throw error;
		}
		return next();
	};
};
