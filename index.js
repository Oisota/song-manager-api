const express = require('express');
const bodyParser = require('body-parser');

const songs = require('./songs');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 6505;


router = express.Router();

router.get('/', (req, res) => {
	res.json({message: 'Welcome to the Song Manager API!'});
});

app.use('/api', router);
app.use('/api/songs', songs);

app.listen(port);
console.log('Listening on port: ' + port);
