'use strict';

// Debug
const Debug = require('../utils/Debug');


//
// Debug data
//
const debugData = Debug.getJSON('nfc');


/**
 * Nfc
 */
module.exports = class Nfc {
	constructor() {}

	/**
	 * read
	 * @param {String} type  Type of nfc data to read
	 */
	read(type) {
		return new Promise((resolve, reject) => {
			if (debugData[type]) {
				resolve(debugData[type]);
			} else {
				reject(`Nfc type ${type} not supported`);
			}
		});
	}
};
