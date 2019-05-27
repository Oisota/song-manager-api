const express = require('express');

const database = require('./database');

const router = express.Router();
const db = database.getDB();

router.route('/me')
	.get((req, res) => {
		/* TODO figure how to load user */
		const q = `
			select id
			from user
			where auth0_id = :sub;`;
		const user = db.prepare(q).get(req.user);
		if (!user) {
			res.status(404).json({
				message: 'User Not Found'
			});
		}
		res.json(user);
	});

router.route('/users')
	.post((req, res) => {
		const q = 'insert into user (auth0_id) values (:id);';
		db.prepare(q).run({
			id: req.params.auth0ID,
		});
		res.status(201).end();
	});

module.exports = router;