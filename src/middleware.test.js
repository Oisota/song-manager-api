const { describe, it } = require('mocha');
const chai = require('chai');
const { expect } = require('chai');
const spies = require('chai-spies');

chai.use(spies);

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

describe('errorHandler', () => {
});

describe('authRequired', () => {
	it('Should return unauthorized for invalid tokens', () => {
	});
	it('Should call next for valid tokens', () => {
	});
});

describe('role', () => {
	it('Should reject request if user does not have role', () => {
		const req = {
			user: {
				role: {
					name: 'foo'
				}
			}
		};
		const res = {};
		const next = chai.spy(() => {});
		const middlwareFunc = mw.role('bar');
		const fn = () => middlwareFunc(req, res, next);
		expect(fn).to.throw();
		expect(next).to.have.not.been.called();
	});

	it('Should call next if user has role', () => {
		const req = {
			user: {
				role: {
					name: 'foo'
				}
			}
		};
		const res = {};
		const next = chai.spy(() => {});
		mw.role('foo')(req, res, next);
		expect(next).to.have.been.called();
	});
});

describe('validate', () => {
	it('Should call next if schema is valid', () => {
	});
	it('Should return bad request if schema throws error', () => {
	});
});

