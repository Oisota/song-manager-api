const crypto = require('crypto');

const database = require('./database');
const config = require('../config');

const HMAC_ALGO = 'sha256';
const db = database.getDB();

function verify(key, token) {
	const hmac = crypto.createHmac(HMAC_ALGO, key);
	const [data, sig] = token.split(':');
	const dataBuffer = Buffer.from(data, 'base64');
	hmac.update(dataBuffer);
	const hash = hmac.digest('base64');
	return sig === hash
		? JSON.parse(dataBuffer.toString('utf-8'))
		: null; 
}

exports.sign = (key, data) => {
	const hmac = crypto.createHmac(HMAC_ALGO, key);
	const json = JSON.stringify(data);
	const dataBuffer = Buffer.from(json);
	hmac.update(dataBuffer);
	return dataBuffer.toString('base64') + ':' + hmac.digest('base64');
};

/*
 * Require that a user be authenticated
 * If so, load user
 */
exports.requireAuth = (req, res, next) => {
	const data = verify(config.SECRET_KEY, req.token);
	if (!data) {
		res.status(400).end();
	} else {
		q = `
			SELECT user.id, user.email, role.name as 'role'
			FROM user
			INNER JOIN ROLE ON user.role_id = role.id
			WHERE user.id = ?`;
		req.user = db.prepare(q).get(data.id);
		next();
	}
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
