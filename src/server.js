const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bearerToken = require('express-bearer-token');
const helmet = require('helmet');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const config = require('./config');
const api = require('./api');

const app = express();

const jwtCheck = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 10,
		jwksUri: 'https://song-manager.auth0.com/.well-known/jwks.json',
	}),
	audience: 'http://localhost:6505/api/v1',
	issuer: 'https://song-manager.auth0.com/',
	algorithms: ['RS256'],
});

app.disable('x-powered-by');
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bearerToken());
app.use(jwtCheck);
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
app.use(`/api/${config.apiVersion}`, api.songs);
app.use(`/api/${config.apiVersion}`, api.user);

const port = config.PORT;

app.listen(port);
console.log('Listening on port: ' + port);
