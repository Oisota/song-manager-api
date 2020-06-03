/*
 * App health check endpoint, used to send a GET request
 * to in order to check if service is up
 */

const express = require('express');

const { envelope } = require('@/util');

const router = express.Router();

router.route('/')
	.get((req, res) => {
		const data = {
			message: 'Server Up',
		};
		res.status(200).json(envelope(data));
	});

module.exports = router;
