const express = require('express');

const { authRequired, validate } = require('../util');
const { SongSchema } = require('../schemas/songs');

const router = express.Router();

const SongService = require('../services/song');

router.route('/:userID/songs')
	.all(authRequired)
	.get((req, res) => {
		const songs = SongService.getAll(req.params.userID);
		res.json(songs);
	})
	.post(
		validate(SongSchema),
		(req, res) => {
			const song = Object.assign(req.params, req.body); //merge params and body
			const result = SongService.create(song);
			res.status(201).json({
				id: result.id,
			});
		}
	);

router.route('/:userID/songs/:songID')
	.all(authRequired)
	.get((req, res) => {
		const song = SongService.getOne(req.params.userID, req.params.songID);
		if (song) {
			res.json(song);
		} else {
			res.status(404).end();
		}
	})
	.put(
		validate(SongSchema),
		(req, res) => {
			const song = Object.assign(req.params, req.body); //merge params and body
			const result = SongService.update(song);
			if (result) {
				res.status(204).end();
			} else {
				res.status(404).end();
			}
		}
	)
	.delete((req, res) => {
		const song = req.params;
		const result = SongService.delete(song);
		if (result) {
			res.status(204).end();
		} else {
			res.status(404).end();
		}
	});

module.exports = router;
