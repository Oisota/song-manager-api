const express = require('express');
const asyncHandler = require('express-async-handler');

const { authRequired, validate } = require('@/middleware');
const { SongSchema } = require('@/schemas/songs');
const { envelope } = require('@/envelope');
const SongService = require('@/services/song');

const router = express.Router();

router.route('/:userId/songs')
	.all(authRequired)
	.get(
		asyncHandler(async (req, res) => {
			const songs = await SongService.getAll(req.user);
			res.json(envelope(songs));
		}),
	)
	.post(
		validate(SongSchema),
		asyncHandler(async (req, res) => {
			const song = Object.assign(req.params, req.body); //merge params and body
			const result = await SongService.create(song);
			res.status(201).json(envelope(result));
		})
	);

router.route('/:userId/songs/:id')
	.all(authRequired)
	.get(asyncHandler(async (req, res) => {
		const song = await SongService.getOne(req.params.userId, req.params.id);
		if (song) {
			res.json(envelope(song));
		} else {
			res.status(404).end();
		}
	}))
	.put(
		validate(SongSchema),
		asyncHandler(async (req, res) => {
			const song = Object.assign(req.params, req.body); //merge params and body
			const result = await SongService.update(song);
			if (result) {
				res.status(204).end();
			} else {
				res.status(404).end();
			}
		})
	)
	.delete(asyncHandler(async (req, res) => {
		const song = req.params;
		const result = SongService.delete(song);
		if (result) {
			res.status(204).end();
		} else {
			res.status(404).end();
		}
	}));

module.exports = router;
