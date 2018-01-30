/**
 * @module api/auth
 */
const database = require('./database');
const S = require('secure-serializer');

const config = require('../config');
const db = database.getDB();

const maxTokenAge = 86400 * 2; // 2 days

/**
 * Middleware that checks that a user is authenticated
 * @arg {Object} req - the Express request object
 * @arg {Object} req - the Express response object
 * @arg {Function} next - the Express next middleware function
 */
exports.authRequired = (req, res, next) => {
	let data = null;
	try {
		data = S.parse(req.token);
	} catch(e) {
		res.status(400).end();
	}
	const tokenAge = Math.floor(Date.now() / 1000) - data.created;
	const tokenExpired = tokenAge > maxTokenAge;
	const userIDMismatch = data.id !== req.params.userID;
	if (tokenExpired || userIDMismatch) {
		res.status(401).end();
	}
	next();
};
