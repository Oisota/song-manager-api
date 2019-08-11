const express = require('express');
const passport = require('passport');

const database = require('./database');

const router = express.Router();
const db = database.getDB();

router.route('/me')
	.all(passport.authenticate('jwt', {session: false}))
	.get((req, res) => {
		const q = `
			SELECT
				u.id AS 'id',
				r.name AS 'role'
			FROM user AS u
			INNER JOIN role AS r ON r.id = u.role_id
			WHERE u.id = :id;`;
		const user = db.prepare(q).get(req.user);
		if (!user) {
			res.status(404).json({
				message: 'User Not Found'
			});
		}
		res.json(user);
	});

module.exports = router;
