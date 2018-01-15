const express = require('express');
const database = require('./database');

const router = express.Router();
const db = database.getDB();

router.route('/')
.get((req, res) => {
	const setlists = db.prepare('SELECT * FROM setlist;')
		.all()
	res.json({setlists})
})
.post((req, res) => {
	const setlist = req.body;
	db.prepare('INSERT INTO setlist (name) VALUES (:name);')
		.run(setlist);

	const newSetList = db.prepare('SELECT * FROM setlist WHERE name = ?;')
		.get(setlist.name);

	res.status(201);
	res.json(newSetList);
	res.end();
});

router.route('/:id')
.get((req, res) => {
	const setlist = db.prepare('SELECT * FROM setlist WHERE id = ?;')
		.get(req.params.id);

	if (setlist) {
		res.json(setlist);
	} else {
		res.status(404).end();
	}
})
.put((req, res) => {
	const setlist = Object.assign({id: req.params.id}, req.body);
	const info = db.prepare('UPDATE setlist SET name = :name WHERE id = :id;')
		.run(setlist);
	if (info.changes > 0) {
		res.status(204).end();
	} else {
		res.status(404).end();
	}
})
.delete((req, res) => {
	const id = req.params.id;
	const info = db.prepare('DELETE FROM setlist WHERE id = ?;')
		.run(id);
	if (info.changes > 0) {
		res.status(204).end()
	} else {
		res.status(404).end()
	}
});

router.route('/:id/songs')
.get((req, res) => {
	const q = `
		SELECT * 
		FROM song 
		INNER JOIN song_setlist 
		ON song.id = song_setlist.song_id 
		WHERE song_setlist.setlist_id = ?;`
	const songs = db.prepare(q)
		.all(req.params.id);

	if (songs) {
		res.json({songs});
	} else {
		res.status(404).end();
	}
})

router.route('/:setlist_id/songs/:song_id')
.put((req, res) => {
	const q = `
		INSERT INTO song_setlist (setlist_id, song_id) 
		VALUES (:setlist_id, :song_id);`;
	const info = db.prepare(q)
		.run(req.params);
	if (info.changes > 0) {
		res.status(204).end()
	} else {
		res.status(404).end()
	}
})

module.exports = router;
