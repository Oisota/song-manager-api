const database = require('../../database');

const db = database.getDB();

/*
 * Get all songs for a given user
 */
exports.getAll = (userID) => {
	const q = `
		SELECT
			id,
			user_id,
			name,
			artist,
			album,
			genre,
			length_ as 'length'
		FROM song
		WHERE user_id = ?;`;
	const songs = db.prepare(q)
		.all(userID);
	return songs;
};

/*
 * Get all a single for a given user
 */
exports.getOne = (userId, songId) => {
	const q = `
		SELECT
			id,
			user_id,
			name,
			artist,
			album,
			genre,
			length_ as 'length'
		FROM song
		WHERE
			id = :songID AND
			user_id = :userID;`;
	const song = db.prepare(q)
		.get({
			userID: userId,
			songID: songId,
		});
	return song;
};

/*
 * create new song for a given user
 */
exports.create = (song) => {
	let q = `
		INSERT INTO song (name, artist, album, genre, length_, user_id)
		VALUES (:name, :artist, :album, :genre, :length, :userID);`;
	const info = db.prepare(q).run(song);
	return {
		id: info.lastInsertRowid,
	};
};

/*
 * update song for a given user
 */
exports.update = (song) => {
	const q = `
		UPDATE song
		SET name = :name, artist = :artist, album = :album, genre = :genre, length_ = :length
		WHERE
			id = :songID AND
			user_id = :userID;`;
	const info = db.prepare(q)
		.run(song);
	return info.changes === 1;
};

/*
 * delete song for a given user
 */
exports.delete = (song) => {
	const q = `
		DELETE FROM song
		WHERE
			id = :songID AND
			user_id = :userID;`;
	const info = db.prepare(q)
		.run(song);
	return info.changes === 1;
};
