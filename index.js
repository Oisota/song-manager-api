const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bearerToken = require('express-bearer-token');
const helmet = require('helmet');

const api = require('./api');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bearerToken());
app.use(morgan('dev'));
app.use((req, res, next) => { // allow cors
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	if (req.method === 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});
app.use('/api', api.songs);
app.use('/api', api.setlists);
app.use('/api/auth', api.auth);

const port = process.env.PORT || 6505;

app.listen(port);
console.log('Listening on port: ' + port);
