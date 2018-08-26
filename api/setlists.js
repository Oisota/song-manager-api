const express = require('express');
const passport = require('passport');

const database = require('./database');

const router = express.Router();
const db = database.getDB();

/*
 * GET all setlists
 * POST create new set list
 */
router.route('/users/:userID/setlists')
	.all(passport.authenticate('jwt'))
	.get((req, res) => {
		const q = `
			SELECT *
			FROM setlist;`;
		const setlists = db.prepare(q)
			.all();
		res.json({setlists});
	})
	.post((req, res) => {
		const setlist = req.body;
		let q = `
			INSERT INTO setlist (name)
			VALUES (:name);`;
		db.prepare(q)
			.run(setlist);

		q = `
			SELECT *
			FROM setlist
			WHERE name = ?;`;
		const newSetList = db.prepare(q)
			.get(setlist.name);

		res.status(201);
		res.json(newSetList);
		res.end();
	});

/*
 * Update individual setlists
 */
router.route('users/:userID/setlists/:id')
	.all(passport.authenticate('jwt'))
	.get((req, res) => {
		const q = `
			SELECT *
			FROM setlist
			WHERE id = ?;`;
		const setlist = db.prepare(q)
			.get(req.params.id);

		if (setlist) {
			res.json(setlist);
		} else {
			res.status(404).end();
		}
	})
	.put((req, res) => {
		const setlist = Object.assign({id: req.params.id}, req.body);
		const q = `
			UPDATE setlist
			SET name = :name
			WHERE id = :id;`;
		const info = db.prepare(q)
			.run(setlist);
		if (info.changes > 0) {
			res.status(204).end();
		} else {
			res.status(404).end();
		}
	})
	.delete((req, res) => {
		const id = req.params.id;
		const q = `
			DELETE FROM setlist
			WHERE id = ?;`;
		const info = db.prepare(q)
			.run(id);

		if (info.changes > 0) {
			res.status(204).end();
		} else {
			res.status(404).end();
		}
	});

/*
 * GET all songs in a setlist
 */
router.route('users/:userID/setlists/:id/songs')
	.all(passport.authenticate('jwt'))
	.get((req, res) => {
		const q = `
			SELECT *
			FROM song
			INNER JOIN song_setlist
			ON song.id = song_setlist.song_id
			WHERE song_setlist.setlist_id = ?;`;
		const songs = db.prepare(q)
			.all(req.params.id);

		if (songs) {
			res.json({songs});
		} else {
			res.status(404).end();
		}
	});

/*
 * Add song to individual setlist
 */
router.route('/users/:userID/:setlist_id/songs/:song_id')
	.all(passport.authenticate('jwt'))
	.put((req, res) => {
		const q = `
			INSERT INTO song_setlist (setlist_id, song_id)
			VALUES (:setlist_id, :song_id);`;
		const info = db.prepare(q)
			.run(req.params);

		if (info.changes > 0) {
			res.status(204).end();
		} else {
			res.status(404).end();
		}
	})
	.delete((req, res) => {
		const q = `
			DELETE FROM song_setlist
			WHERE song_id = :song_id
			AND setlist_id = :setlist_id;`;
		const info = db.prepare(q)
			.run(req.params);

		if (info.changes > 0) {
			res.status(204).end();
		} else {
			res.status(404).end();
		}
	});

module.exports = router;
