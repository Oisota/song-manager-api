const express = require('express');
const bcrypt = require('bcrypt');

const config = require('../config');
const database = require('./database');
const util = require('./util');

const role = util.role;
const requireAuth = util.requireAuth;
const router = express.Router();
const db = database.getDB();

router.route('/login')
.post(async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const q = `
		SELECT id, hash
		FROM user
		WHERE email = ?;`;
	const user = db.prepare(q).get(email);
	const validPassword = await bcrypt.compare(password, user.hash);
	if (validPassword) {
		const token = util.sign(config.SECRET_KEY, {id: user.id});
		res.status(200);
		res.json({token});
		res.end();
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
		WHERE name = ?;`
	const role = db.prepare(q).get('user');
	const roleID = role['id'];

	q = `
		INSERT INTO user (email, hash, role_id)
		VALUES (:email, :hash, :roleID);`
	db.prepare(q).run({
		email,
		hash,
		roleID
	});

	res.status(201).end();
});

router.route('/account-requests')
.all(requireAuth)
.all(role('admin'))
.get((req, res) => {
});

router.route('/verify/:id')
.all(requireAuth)
.all(role('admin'))
.post((req, res) => {
});

module.exports = router;
