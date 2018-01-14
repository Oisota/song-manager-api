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

module.exports = router;
