'use strict';

const fs = require('fs');
const path = require('path');


let home = process.env[process.plattfrom === 'win32' ? 'USERPROFILE' : 'HOME'];
let dataRoot = path.join(home, '_nfc-pay');

module.exports = {
	getJSON(name) {
		try {
			let file = fs.readFileSync(path.join(dataRoot, name + '.json'), 'utf8');
			return JSON.parse(file);
		} catch (ex) {
			console.error('error when trying to read local data');
			throw ex;
		}
	}
};
