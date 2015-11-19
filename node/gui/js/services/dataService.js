'use strict';

var data = null;

module.exports = {

	setData(setData) {
		data = setData;
	},

	get(key) {
		if (!data) return null;

		return data[key];
	}
};