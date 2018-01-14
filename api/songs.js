const express = require('express');
const database = require('./database');

const router = express.Router();
const db = database.getDB();

router.route('/')
.get((req, res) => {
	const songs = db.prepare('SELECT * FROM song;').all();
	res.json({songs});
})
.post((req, res) => {
	const song = req.body;
	db.prepare('INSERT INTO song (name, artist, album, genre, minutes, seconds) VALUES (:name, :artist, :album, :genre, :minutes, :seconds);')
		.run(song);

	const newSong = db.prepare('SELECT * FROM song WHERE name = ?;')
		.get(song.name);

	res.status(201);
	res.json(newSong);
	res.end();
});

router.route('/:id')
.get((req, res) => {
	const song = db.prepare('SELECT * FROM song WHERE id = ?;')
		.get(req.params.id);

	if (song) {
		res.json(song);
	} else {
		res.status(404).end();
	}
})
.put((req, res) => {
	const song = Object.assign({id: req.params.id}, req.body);
	const info = db.prepare('UPDATE song SET name = :name, artist = :artist, album = :album, genre = :genre, minutes = :minutes, seconds = :seconds WHERE id = :id;')
		.run(song);
	if (info.changes > 0) {
		res.status(204).end();
	} else {
		res.status(404).end();
	}
})
.delete((req, res) => {
	const id = req.params.id;
	const info = db.prepare('DELETE FROM song WHERE id = ?;')
		.run(id);
	if (info.changes > 0) {
		res.status(204).end()
	} else {
		res.status(404).end()
	}
});

module.exports = router;
