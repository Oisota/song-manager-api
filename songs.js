const express = require('express');

const router = express.Router();

router.route('/')
.get((req, res) => {
	res.json({songs: ['here', 'is', 'some', 'songs']});
})
.post((req, res) => {
	res.json({songs: ['here', 'is', 'some', 'songs']});
});

module.exports = router;
