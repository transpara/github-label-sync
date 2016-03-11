'use strict';

const assert = require('proclaim');

describe('lib/github-label-sync', () => {
	let githubLabelSync;

	beforeEach(() => {
		githubLabelSync = require('../../../lib/github-label-sync');
	});

	it('should export a function', () => {
		assert.isFunction(githubLabelSync);
	});

	describe('githubLabelSync()', () => {
		let returnedPromise;

		beforeEach(() => {
			returnedPromise = githubLabelSync();
		});

		it('should return a promise', function() {
			assert.instanceOf(returnedPromise, Promise);
		});

	});

});
