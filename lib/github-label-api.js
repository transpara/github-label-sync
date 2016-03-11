'use strict';

const github = require('octonode');

module.exports = createApiClient;

class ApiClient {

	constructor (accessToken) {
		this.apiClient = github.client(accessToken);
	}

	getLabels (repo) {
		return new Promise((resolve, reject) => {
			this.apiClient.get(`/repos/${repo}/labels`, {}, (error, status, labels) => {
				if (error) {
					return reject(error);
				}
				if (status !== 200) {
					return reject(new Error(`API responded with ${status} status`));
				}
				resolve(labels);
			});
		});
	}

	createLabel (repo, label) {
		return new Promise((resolve, reject) => {
			this.apiClient.post(`/repos/${repo}/labels`, label, (error, status, createdLabel) => {
				if (error) {
					return reject(error);
				}
				if (status !== 201) {
					return reject(new Error(`API responded with ${status} status`));
				}
				resolve(createdLabel);
			});
		});
	}

	updateLabel (repo, labelName, label) {
		labelName = encodeURIComponent(labelName);
		return new Promise((resolve, reject) => {
			this.apiClient.patch(`/repos/${repo}/labels/${labelName}`, label, (error, status, updatedLabel) => {
				if (error) {
					return reject(error);
				}
				if (status !== 200) {
					return reject(new Error(`API responded with ${status} status`));
				}
				resolve(updatedLabel);
			});
		});
	}

	deleteLabel (repo, labelName) {
		labelName = encodeURIComponent(labelName);
		return new Promise((resolve, reject) => {
			this.apiClient.del(`/repos/${repo}/labels/${labelName}`, {}, (error, status) => {
				if (error) {
					return reject(error);
				}
				if (status !== 204) {
					return reject(new Error(`API responded with ${status} status`));
				}
				resolve();
			});
		});
	}

}

function createApiClient(accessToken) {
	return new ApiClient(accessToken);
}
