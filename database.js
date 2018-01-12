const Database = require('better-sqlite3');
const config = require('./config');

let conn = null;

exports.getDB = () => {
	if (!conn) {
		conn = new Database(config.dbFile);
	}
	return conn;
}
