const config = require(process.env.CONFIG_FILE);

exports.PORT = process.env.PORT;
exports.DB_FILE = config.DB_FILE;
exports.SECRET_KEY = config.SECRET_KEY;
exports.API_VERSION = 'v1';

