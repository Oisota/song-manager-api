const SongRepo = require('../repositories/song');

/*
 * Get all songs for a given user
 */
exports.getAll = (userID) => {
	const songs = SongRepo.getAll(userID);
	return songs;
};

/*
 * Get all a single for a given user
 */
exports.getOne = (userID, songID) => {
	const song = SongRepo.getOne(userID, songID);
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
