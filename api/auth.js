const express = require('express');
const bcrypt = require('bcrypt');

const config = require('../config');
const database = require('./database');
const util = require('./util');

const requiredRole = util.role;
const requireAuth = util.requireAuth;
const router = express.Router();
const db = database.getDB();

router.route('/login')
	.post(async (req, res) => {
		const email = req.body.email;
		const password = req.body.password;
		const q = `
			SELECT user.id, user.hash, role.name as 'role'
			FROM user
			INNER JOIN role ON role.id = user.role_id
			WHERE email = ?;`;
		const user = db.prepare(q).get(email);
		const validPassword = await bcrypt.compare(password, user.hash);
		if (validPassword) {
			const token = util.sign(config.SECRET_KEY, {id: user.id});
			res.status(200);
			res.json({
				token: token,
				role: user.role,
				id: user.id,
			});
		} else {
			res.status(401).end();
		}
	});

router.route('/register')
	.post(async (req, res) => {
		const email = req.body.email;
		const password = req.body.password;
		const hash = await bcrypt.hash(password, 10);

		let q = `
			SELECT id
			FROM role
			WHERE name = ?;`;
		const role = db.prepare(q).get('user');
		const roleID = role['id'];

		q = `
			INSERT INTO user (email, hash, role_id)
			VALUES (:email, :hash, :roleID);`;
		const info = db.prepare(q).run({
			email,
			hash,
			roleID
		});

		if (info.changes < 1) {
			res.status(500).end();
		} else {
			res.status(201).end();
		}
	});

router.route('/account-requests')
	.all(requireAuth)
	.all(requiredRole('admin'))
	.get((req, res) => {
		const q = `
			SELECT id, email
			FROM user
			WHERE NOT verified;`;
		const users = db.prepare(q).all();
		res.json(users);
	});

router.route('/verify/:id')
	.all(requireAuth)
	.all(requiredRole('admin'))
	.post((req, res) => {
		const q = `
			UPDATE user
			SET verified = 1
			WHERE id = ?;`;
		const info = db.prepare(q).run(req.params.id);
		if (info.changes < 1) {
			res.status(500).end();
		} else {
			res.status(204).end();
		}
	});

module.exports = router;
