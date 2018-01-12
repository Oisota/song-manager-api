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
	db.prepare('insert into song (name, artist, album, genre, minutes, seconds) values (:name, :artist, :album, :genre, :minutes, :seconds);')
		.run(song);
	res.status(201).end();
});

router.route('/:id')
.delete((req, res) => {
	const id = req.params.id;
	const info = db.prepare('delete from song where id = ?;')
		.run(id);
	if (info.changes > 0) {
		res.status(204).end()
	} else {
		res.status(404).end()
	}
});

module.exports = router;
