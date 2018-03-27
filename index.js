const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bearerToken = require('express-bearer-token');

const api = require('./api');

const app = express();
app.disable('x-powered-by');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bearerToken());
app.use(morgan('dev'));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	if (req.method === 'options') {
		res.status(200).end();
	} else {
		next();
	}
});
app.use('/api/songs', api.songs);
app.use('/api/setlists', api.setlists);
app.use('/api/auth', api.auth);

const port = process.env.PORT || 6505;

app.listen(port);
console.log('Listening on port: ' + port);
