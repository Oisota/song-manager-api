const Sequelize = require('sequelize');

const db = require('@/database');
const RoleModel = require('@/models/role');

class UserModel extends Sequelize.Model {}

UserModel.init({
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
