'use strict';

const actionLabelDiff = require('./action-label-diff');
const calculateLabelDiff = require('./calculate-label-diff');
const extend = require('node.extend');
const githubLabelApi = require('./github-label-api');
const stringifyLabelDiff = require('./stringify-label-diff');

module.exports = githubLabelSync;

/* istanbul ignore next */
module.exports.defaults = {
	accessToken: null,
	dryRun: false,
	labels: [],
	log: {
		error() {},
		info() {},
		warn() {}
	},
	repo: null
};

function githubLabelSync(options) {
	options = extend(true, {}, module.exports.defaults, options);

	const apiClient = githubLabelApi(options.accessToken);
	const log = options.log;
	let labelDiff;

	log.info(`Fetching labels for "${options.repo}"`);

	return apiClient.getLabels(options.repo)
		.then((currentLabels) => {
			labelDiff = calculateLabelDiff(currentLabels, options.labels);
			stringifyLabelDiff(labelDiff).forEach(diffLine => log.info(diffLine));
			return labelDiff;
		})
		.then((labelDiff) => {
			if (options.dryRun) {
				return [];
			}
			const diffActions = actionLabelDiff({
				apiClient: apiClient,
				diff: labelDiff,
				repo: options.repo
			});
			return Promise.all(diffActions);
		})
		.then((results) => {
			if (options.dryRun) {
				log.info('This is a dry run. No changes have been made on GitHub');
			} else if (results.length === 0) {
				log.info('Labels are already up to date');
			} else {
				log.info('Labels updated');
			}
			return labelDiff;
		});
}
