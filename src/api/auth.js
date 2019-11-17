const express = require('express');
const bcrypt = require('bcrypt');

const database = require('../database');
const util = require('../util');
const AuthService = require('./services/auth');

const authRequired = util.authRequired;
const router = express.Router();
const db = database.getDB();

router.route('/login')
	.post(util.asyncMiddleware(async (req, res) => {
		const email = req.body.email;
		const password = req.body.password;
		let token = null;
		try {
			token = await AuthService.login(email, password);
		} catch (err) {
			console.error(err);
			const e = new Error('Invalid email or password');
			e.statusCode = 401;
			throw e;
		}
		res.status(200);
		res.json({
			token: token,
		});
	}));

router.route('/register')
	.post(util.asyncMiddleware(async (req, res) => {
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
	}));

router.route('/account-requests')
	.all(authRequired)
	.all(util.role('admin'))
	.get((req, res) => {
		const users = AuthService.accountRequests();
		return res.json(users).end();
	});

router.route('/verify/:id')
	.all(authRequired)
	.all(util.role('admin'))
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
