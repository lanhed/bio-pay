'use strict';

const fs = require('fs');
const path = require('path');

const rootFolder = 'local-data';

module.exports = {
	getJSON(name) {
		let result = {};

		try {
			const fileContent = fs.readFileSync(path.join(rootFolder, name + '.json'), 'utf8');
			result = JSON.parse(fileContent);
		} catch (ex) {
			console.error(ex);
		}

		return result;
	}
};
