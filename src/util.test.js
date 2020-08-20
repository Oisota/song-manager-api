const {describe, it} = require('mocha');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

const util = require('@/util');

describe('envelope', () => {
	it('Should create a response envelope', () => {
		const data = {
			foo: 'bar',
		};
		const wrapped = {
			data: data,
			error: null,
		};
		const result = util.envelope(data, null);
		expect(result).to.deep.equal(wrapped);
	});
});

describe('jwtSign', () => {
	it('Should return a promise', () => {
		const data = {
			foo: 'bar'
		};
		const result = util.jwtSign(data);
		expect(result).to.be.a('promise');
	});

	it('Should resolve to a jwt string', async () => {
		const data = {
			foo: 'bar'
		};
		const result = await util.jwtSign(data);
		expect(result).to.be.a('string');
	});
});

describe('jwtVerify', () => {
	it('Should return a promise', () => {
		const token = 'this an invalid token';
		const opts = {};
		const result = util.jwtVerify(token, opts);
		result.catch(() => {}); // prevent unhandled promise reject message
		expect(result).to.be.a('promise');
	});

	it('Should throw for invalid tokens', async () => {
		const token = 'this an invalid token';
		const opts = {};
		try {
			const _ = await util.jwtVerify(token, opts);
		} catch (e) {
			expect(e).to.be.a(typeof (new jwt.JsonWebTokenError()));
			return;
		}
	});
});
