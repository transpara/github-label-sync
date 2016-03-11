#!/usr/bin/env node
'use strict';

const githubLabelSync = require('../lib/github-label-sync');
const path = require('path');
const pkg = require('../package.json');
const program = require('commander');

// Command-line configuration
program
	.version(pkg.version)
	.usage('[options] <repository>')
	.option(
		'-a, --access-token <access-token>',
		'a GitHub access token to make requests with',
		process.env.GITHUB_ACCESS_TOKEN
	)
	.option(
		'-l, --labels <path>',
		'the path to look for the label configuration in. Default: ./.labels',
		'.labels'
	)
	.parse(process.argv);

// Make sure we have exactly one argument – the repo
if (program.args.length !== 1) {
	program.help();
}

// Resolve the label configuration path
if (!/^[\/\~]/.test(program.labels)) {
	program.labels = path.resolve(process.cwd(), program.labels);
}

// Load the labels
let labels = [];
try {
	labels = require(program.labels);
} catch (error) {
	console.error(`No labels were found in ${program.labels}`);
	process.exit(1);
}

// Pull together all the options
const options = {
	accessToken: program.accessToken,
	labels: labels,
	log: console,
	repo: program.args[0]
};

// Sync the labels!
githubLabelSync(options).catch((error) => {
	console.error(error.stack || error.message);
	process.exit(1);
});
