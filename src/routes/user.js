const express = require('express');

const { authRequired } = require('../util');
const UserService = require('../services/user');

const router = express.Router();

router.route('/me')
	.all(authRequired)
	.get((req, res) => {
		const userID = req.user.id;
		const user = UserService.getOwnInfo(userID);
		if (!user) {
			const err = new Error('User Not Found');
			err.statusCode = 404;
			throw err;
		}
		res.json(user);
	});

module.exports = router;
