'use strict';

const fs = require('fs');
const path = require('path');

const root = 'local-data';

module.exports = {
	readJSON(name) {
		return JSON.parse(fs.readFileSync(path.join(root, name + '.json'), 'utf8'));
	}
};