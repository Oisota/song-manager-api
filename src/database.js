const Sequelize = require('sequelize');
const config = require('@/config');

exports.sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: config.DB_FILE,
});
