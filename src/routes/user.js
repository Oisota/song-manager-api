const express = require('express');
const asyncHandler = require('express-async-handler');

const { authRequired } = require('../util');
const UserService = require('../services/user');

const router = express.Router();

router.route('/me')
	.all(authRequired)
	.get(asyncHandler(async (req, res) => {
		const user = await UserService.getOwnInfo(req.user.id);
		if (!user) {
			const err = new Error('User Not Found');
			err.statusCode = 404;
			throw err;
		}
		res.json(user);
	}));

module.exports = router;
