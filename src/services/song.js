const SongRepo = require('../repositories/song');
const SongModel = require('../models/song');

/*
 * Get all songs for a given user
 */
exports.getAll = async (userID) => {
	//const songs = SongRepo.getAll(userID);
	const songs = await SongModel.findAll({
		where: {
			user_id: userID,
		}
	});
	return songs;
};

/*
 * Get a single song for a given user
 */
exports.getOne = async (userID, songID) => {
	const song = await SongModel.findByPk(songID);
	return song;
};

/*
 * create new song for a given user
 */
exports.create = (song) => {
	const result = SongRepo.create(song);
	return result;
};

/*
 * update song for a given user
 */
exports.update = (song) => {
	const result = SongRepo.update(song);
	return result;
};

/*
 * delete song for a given user
 */
exports.delete = (song) => {
	const result = SongRepo.delete(song);
	return result;
};
