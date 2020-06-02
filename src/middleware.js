const asyncHandler = require('express-async-handler');
const sequelize = require('sequelize');
const superstruct = require('superstruct');

const UserService = require('@/services/user');
const { jwtVerify, envelope } = require('@/util');

/*
 * Catch all route for returning 404s
 */
exports.catchAllRoute = (req, res, next) => {
	const err = new Error('URL Not Found');
	err.statusCode = 404;
	next(err);
};

/*
 * Handle application errors
 */
exports.errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
	if (err instanceof sequelize.ValidationError) {
		console.log('Sequelize Error');
		console.log(err);
		console.log(err.message);
		console.log(err.errors);
	} else if (err instanceof superstruct.StructError) {
		console.log('SuperStruct Error');
		console.error(err.message);
	} else {
		console.log('Server Error');
		console.error(err.message);
	}
	res.status(err.statusCode || 500) // send internal server error code if not already set
		.json(envelope(null, {
			message: err.message || 'Internal Server Error', // set message if not already set
		}));
};

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
	const user = await UserService.getById(payload.sub);
	if (user) {
		req.user = user;
		return next();
	}
	const err = new Error('Unauthorized');
	err.statusCode = 401;
	throw err;
});



/*
 * Require that a user has a certain role
 */
exports.role = (role) => (req, res, next) => {
	if (req.user.role.name === role) {
		next();
	} else {
		console.error(`User id: ${req.user.id} does not have role: ${role}`);
		const err = new Error('Forbidden');
		err.statusCode = 403;
		throw err;
	}
};

/*
 * Validation Middleware using superstruct
 */
exports.validate = (schema) => {
	return (req, res, next) => {
		const [error] = schema.validate(req.body);
		if (error) {
			error.statusCode = 400;
			throw error;
		}
		return next();
	};
};
