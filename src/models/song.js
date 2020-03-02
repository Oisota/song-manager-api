const Sequelize = require('sequelize');

const db = require('../database');
const UserModel = require('./user');

class SongModel extends Sequelize.Model {}

SongModel.init({
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	user_id: {
		type: Sequelize.INTEGER,
		references: {
			model: UserModel,
			key: 'id',
		}
	},
	name: {
		type: Sequelize.STRING,
	},
	artist: {
		type: Sequelize.STRING,
	},
	album: {
		type: Sequelize.STRING,
	},
	genre: {
		type: Sequelize.STRING,
	},
	length_: {
		type: Sequelize.INTEGER,
	},
}, {
	sequelize: db.sequelize,
	modelName: 'song',
	timestamps: false,
	tableName: 'song',
});

module.exports = SongModel;
