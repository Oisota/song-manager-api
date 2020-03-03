const SongModel = require('../models/song');

/*
 * Get all songs for a given user
 */
exports.getAll = async (user) => {
	const songs = await user.getSongs();
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
exports.create = async (song) => {
	const result = await SongModel.create(song, {
		fields: ['userId', 'name', 'artist', 'album', 'genre', 'length'],
	});
	return result;
};

/*
 * update song for a given user
 */
exports.update = async (song) => {
	console.log(song.id);
	const oldSong = await SongModel.findByPk(song.id);
	const result = await oldSong.update(song);
	return result;
};

/*
 * delete song for a given user
 */
exports.delete = async (data) => {
	const song = await SongModel.findByPk(data.id);
	const result = await song.destroy();
	return result;
};
