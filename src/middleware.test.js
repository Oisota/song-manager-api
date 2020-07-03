const { describe } = require('mocha');
const { expect } = require('chai');

const mw = require('@/middleware');

describe('catchAllRoute', () => {
	it('Should have 404 status', () => {
		const req = {};
		const res = {};
		const next = (err) => {
			expect(err.statusCode).to.eq(404);
			expect(err.message).to.be.a('string');
		};
		mw.catchAllRoute(req, res, next);
	});
});
