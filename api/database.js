/**
 * @module api/database
 */
const Database = require('better-sqlite3');
const config = require('../config');

let conn = null;

/**
 * Get a database connection
 * @returns {Object} - the database connection
 */
exports.getDB = () => {
	if (!conn) {
		conn = new Database(config.dbFile);
	}
	return conn;
}
