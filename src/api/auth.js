const express = require('express');

const util = require('../util');
const AuthService = require('./services/auth');

const authRequired = util.authRequired;
const router = express.Router();

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
		const result = await AuthService.register(email, password);

		if (result) {
			res.status(201);
			res.json({
				id: result.id,
			});
		} else {
			res.status(500).end();
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
		const result = AuthService.verify(res.params.id);
		if (result) {
			res.status(204).end();
		} else {
			res.status(500).end();
		}
	});

module.exports = router;
