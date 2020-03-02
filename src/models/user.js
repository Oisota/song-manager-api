const Sequelize = require('sequelize');

const db = require('../database');
const RoleModel = require('./role');

class UserModel extends Sequelize.Model {}

UserModel.init({
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	email: {
		type: Sequelize.STRING,
	},
	hash: {
		type: Sequelize.STRING,
	},
	verified: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
}, {
	sequelize: db.sequelize,
	modelName: 'user',
	timestamps: false,
	tableName: 'user',
	underscored: true,
});

UserModel.belongsTo(RoleModel);

module.exports = UserModel;
