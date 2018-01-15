const express = require('express');
const database = require('./database');

const router = express.Router();
const db = database.getDB();

router.route('/')
.get((req, res) => {
	const q = `
		SELECT *
		FROM song;`;
	const songs = db.prepare(q).all();
	res.json({songs});
})
.post((req, res) => {
	const song = req.body;
	let q = `
		INSERT INTO song (name, artist, album, genre, minutes, seconds)
		VALUES (:name, :artist, :album, :genre, :minutes, :seconds);`;
	db.prepare(q)
		.run(song);

	q = `
		SELECT *
		FROM song
		WHERE name = ?;`;
	const newSong = db.prepare(q)
		.get(song.name);

	res.status(201);
	res.json(newSong);
	res.end();
});

router.route('/:id')
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
	const id = req.params.id;
	const q = `
		DELETE FROM song
		WHERE id = ?;`;
	const info = db.prepare(q)
		.run(id);
	if (info.changes > 0) {
		res.status(204).end()
	} else {
		res.status(404).end()
	}
});

module.exports = router;
