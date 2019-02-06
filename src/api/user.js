const express = require('express');

const router = express.Router();

router.route('/me')
	.get((req, res) => {
		res.json({
			id: 1,
		});
	});

module.exports = router;