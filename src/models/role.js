const Sequelize = require('sequelize');

const db = require('../database');

class RoleModel extends Sequelize.Model {}

RoleModel.init({
	name: {
		type: Sequelize.STRING,
	},
}, {
	sequelize: db.sequelize,
	modelName: 'role',
	timestamps: false,
	tableName: 'role',
});

module.exports = RoleModel;
