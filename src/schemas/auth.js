const superstruct = require('superstruct');

exports.UserCredsSchema = superstruct.struct({
	email: 'string',
	password: 'string',
});
