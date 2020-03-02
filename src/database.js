const Sequelize = require('sequelize');
const Database = require('better-sqlite3');
const config = require('./config');

let conn = null;

exports.getDB = () => {
	if (!conn) {
		conn = new Database(config.dbFile);
	}
	return conn;
};

exports.sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: config.dbFile,
});
