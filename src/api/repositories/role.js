const database = require('../../database');

const db = database.getDB();

/*
 * Get all user roles
 */
exports.getByName = (name) => {
	const q = `
		SELECT id, name
		FROM role
		WHERE name = ?;`;
	const role = db.prepare(q).get(name);
	if (!role) {
		throw new Error('Invalid role name');
	}
	return role;
};
