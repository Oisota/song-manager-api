const sequelize = require('sequelize');
const superstruct = require('superstruct');

const { envelope } = require('./envelope');

// catch all route for returning 404
exports.catchAllRoute = (req, res, next) => {
	const err = new Error('URL Not Found');
	err.statusCode = 404;
	next(err);
};

// error handling middleware
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
