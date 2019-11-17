const express = require('express');
const { authRequired } = require('../util');

const UserService = require('./services/user');

const router = express.Router();

router.route('/me')
	.all(authRequired)
	.get((req, res) => {
		const userID = req.user.id;
		const user = UserService.getOwnInfo(userID);
		if (!user) {
			res.status(404).json({
				message: 'User Not Found'
			});
		}
		res.json(user);
	});

module.exports = router;
