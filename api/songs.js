const express = require('express');

const database = require('./database');
const util = require('./util');

const router = express.Router();
const db = database.getDB();

router.route('/users/:userID/songs')
	.all(util.requireAuth)
	.get((req, res) => {
		const q = `
			SELECT *
			FROM song
			WHERE user_id = ?;`;
		const songs = db.prepare(q).all(req.params.userID);
		res.json({songs});
	})
	.post((req, res) => {
		const song = req.body;
		song.userID = req.params.userID;
		let q = `
			INSERT INTO song (name, artist, album, genre, minutes, seconds, user_id)
			VALUES (:name, :artist, :album, :genre, :minutes, :seconds, :userID);`;
		db.prepare(q)
			.run(song);

		q = `
			SELECT *
			FROM song
			WHERE
				name = :name AND
				user_id = :userID;`;
		const newSong = db.prepare(q).get(song);

		res.status(201);
		res.json(newSong);
		res.end();
	});

router.route('/users/:userID/songs/:songID')
	.all(util.requireAuth)
	.get((req, res) => {
		const q = `
			SELECT *
			FROM song
			WHERE id = ?;`;
		const song = db.prepare(q)
			.get(req.params.id);

		if (song) {
			res.json(song);
		} else {
			res.status(404).end();
		}
	})
	.put((req, res) => {
		const song = Object.assign({id: req.params.id}, req.body);
		const q = `
			UPDATE song
			SET name = :name, artist = :artist, album = :album, genre = :genre, minutes = :minutes, seconds = :seconds
			WHERE id = :id;`;
		const info = db.prepare(q)
			.run(song);
		if (info.changes > 0) {
			res.status(204).end();
		} else {
			res.status(404).end();
		}
	})
	.delete((req, res) => {
		const q = `
			DELETE FROM song
			WHERE
				id = :id,
				user_id = :userID;`;
		const info = db.prepare(q)
			.run(req.params);
		if (info.changes > 0) {
			res.status(204).end();
		} else {
			res.status(404).end();
		}
	});

module.exports = router;
