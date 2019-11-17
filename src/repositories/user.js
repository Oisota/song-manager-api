const database = require('../database');

const db = database.getDB();

/*
 * Get a users own info
 */
exports.getOwnInfo = (userID) => {
	const q = `
		SELECT
			u.id AS 'id',
			r.name AS 'role'
		FROM user AS u
		INNER JOIN role AS r ON r.id = u.role_id
		WHERE u.id = ?;`;
	const user = db.prepare(q).get(userID);
	return user;
};

/*
 * Get user by email
 */
exports.getByEmail = (email) => {
	const q = `
		SELECT
			u.id AS 'id',
			u.hash AS 'hash',
			r.name AS 'role'
		FROM user AS u
		INNER JOIN role AS r ON r.id = u.role_id
		WHERE u.email = ?
			AND u.verified;`;
	const user = db.prepare(q).get(email);
	return user;
};

/*
 * Get all unverified users
 */
exports.getUnverified = () => {
	const q = `
		SELECT id, email
		FROM user
		WHERE NOT verified;`;
	const users = db.prepare(q).all();
	return users;
};

/*
 * Verify a user so they can login
 */
exports.verify = (userID) => {
	const q = `
		UPDATE user
		SET verified = 1
		WHERE id = ?`;
	const info = db.prepare(q).run(userID);
	return info.changes === 1;
};

/*
 * create a new user in the system
 */
exports.create = (user) => {
	const q = `
		INSERT INTO user (email, hash, role_id)
		VALUES (:email, :hash, :roleID);`;
	const info = db.prepare(q).run(user);
	return {
		id: info.lastInsertRowid,
	};
};
