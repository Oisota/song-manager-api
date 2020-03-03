const Sequelize = require('sequelize');

const db = require('../database');
const UserModel = require('./user');

class SongModel extends Sequelize.Model {}

SongModel.init({
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
	length: {
		type: Sequelize.INTEGER,
		field: 'length_',
	},
}, {
	sequelize: db.sequelize,
	modelName: 'song',
	timestamps: false,
	tableName: 'song',
	underscored: true,
});

UserModel.hasMany(SongModel, {
	as: 'Songs',
});

module.exports = SongModel;
