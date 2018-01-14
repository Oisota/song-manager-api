const express = require('express');
const database = require('./database');

const router = express.Router();
const db = database.getDB();

router.route('/')
.get((req, res) => {
})
.post((req, res) => {
});

router.route('/:id')
.get((req, res) => {
})
.put((req, res) => {
})
.delete((req, res) => {
})

module.exports = router;
