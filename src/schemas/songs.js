const superstruct = require('superstruct');

exports.SongSchema = superstruct.struct({
	name: 'string',
	artist: 'string',
	album: 'string',
	genre: 'string',
	length: 'number',
});
