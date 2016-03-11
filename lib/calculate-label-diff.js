'use strict';

module.exports = calculateLabelDiff;

function calculateLabelDiff(currentLabels, configuredLabels) {
	const diff = [];
	const resolvedLabels = [];
	configuredLabels.forEach((configuredLabel) => {

		// Get current labels which match the configured label
		const matches = currentLabels.filter((currentLabel) => {
			if (currentLabel.name.toLowerCase() === configuredLabel.name.toLowerCase()) {
				return true;
			}
			if (configuredLabel.aliases && configuredLabel.aliases.indexOf(currentLabel.name.toLowerCase()) !== -1) {
				return true;
			}
		});

		// If we have no matches, the configured label is missing
		if (matches.length === 0) {
			return diff.push(createMissingEntry(configuredLabel));
		}

		// Always take the first match
		const matchedLabel = matches[0];
		resolvedLabels.push(matchedLabel);

		// If we have a match, but properties are not equal
		if (configuredLabel.name !== matchedLabel.name || configuredLabel.color !== matchedLabel.color) {
			return diff.push(createChangedEntry(matchedLabel, configuredLabel));
		}

	});
	currentLabels.filter(label => resolvedLabels.indexOf(label) === -1).forEach((currentLabel) => {
		diff.push(createAddedEntry(currentLabel));
	});
	return diff;
}

function createMissingEntry(expectedLabel) {
	return {
		name: expectedLabel.name,
		type: 'missing',
		actual: null,
		expected: {
			name: expectedLabel.name,
			color: expectedLabel.color
		}
	};
}

function createChangedEntry(actualLabel, expectedLabel) {
	return {
		name: actualLabel.name,
		type: 'changed',
		actual: {
			name: actualLabel.name,
			color: actualLabel.color
		},
		expected: {
			name: expectedLabel.name,
			color: expectedLabel.color
		}
	};
}

function createAddedEntry(actualLabel) {
	return {
		name: actualLabel.name,
		type: 'added',
		actual: {
			name: actualLabel.name,
			color: actualLabel.color
		},
		expected: null
	};
}
