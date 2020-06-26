const { expect } = require('chai');

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
