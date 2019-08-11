const express = require('express');
const passport = require('passport');

const database = require('./database');

const router = express.Router();
const db = database.getDB();

router.route('/:userID/songs')
	.all(passport.authenticate('jwt', {session: false}))
	.get((req, res) => {
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
		const songs = db.prepare(q).all(req.params.userID);
		res.json(songs);
	})
	.post((req, res) => {
		const song = Object.assign(req.params, req.body); //merge params and body
		let q = `
			INSERT INTO song (name, artist, album, genre, length_, user_id)
			VALUES (:name, :artist, :album, :genre, :length, :userID);`;
		db.prepare(q).run(song);

		q = `
			SELECT id
			FROM song
			WHERE
				name = :name AND
				user_id = :userID;`;
		const newSong = db.prepare(q).get(song);

		res.status(201).json(newSong);
	});

router.route('/:userID/songs/:songID')
	.all(passport.authenticate('jwt', {session: false}))
	.get((req, res) => {
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
			.get(req.params);

		if (song) {
			res.json(song);
		} else {
			res.status(404).end();
		}
	})
	.put((req, res) => {
		const song = Object.assign(req.params, req.body); //merge params and body
		const q = `
			UPDATE song
			SET name = :name, artist = :artist, album = :album, genre = :genre, length_ = :length
			WHERE
				id = :songID AND
				user_id = :userID;`;
		const info = db.prepare(q)
			.run(song);

		if (info.changes < 1) {
			res.status(404).end();
		} else {
			res.status(204).end();
		}
	})
	.delete((req, res) => {
		const q = `
			DELETE FROM song
			WHERE
				id = :songID AND
				user_id = :userID;`;
		const info = db.prepare(q)
			.run(req.params);

		if (info.changes < 1) {
			res.status(404).end();
		} else {
			res.status(204).end();
		}
	});

module.exports = router;
