const express = require('express');
const asyncHandler = require('express-async-handler');

const util = require('../util');
const AuthService = require('../services/auth');
const { UserCredsSchema } = require('../schemas/auth');
const { envelope } = require('../envelope');

const authRequired = util.authRequired;
const validate = util.validate;
const router = express.Router();

router.route('/login')
	.post(
		validate(UserCredsSchema),
		asyncHandler(async (req, res) => {
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
			res.json(envelope({
				token: token,
			}));
		})
	);

router.route('/register')
	.post(
		validate(UserCredsSchema),
		asyncHandler(async (req, res) => {
			const email = req.body.email;
			const password = req.body.password;
			const result = await AuthService.register(email, password);

			if (result) {
				res.status(201);
				res.json(envelope({
					id: result.id,
				}));
			} else {
				res.status(500).end();
			}
		})
	);

router.route('/account-requests')
	.all(authRequired)
	.all(util.role('admin'))
	.get(asyncHandler(async (req, res) => {
		const users = await AuthService.accountRequests();
		return res.json(envelope(users)).end();
	}));

router.route('/verify/:id')
	.all(authRequired)
	.all(util.role('admin'))
	.post(asyncHandler(async (req, res) => {
		const result = await AuthService.verify(req.params.id);
		if (result) {
			res.status(204).end();
		} else {
			res.status(500).end();
		}
	}));

module.exports = router;
