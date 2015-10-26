'use strict';

module.exports = {

	getQueryStr(data) {
		let queries = [];

		if (data) {
			for (let key in data) {
				if (!data.hasOwnProperty(key)) continue;

				queries.push(`${key}=${data[key]}`);
			}
		}

		return queries.join('&');
	},

	navigate(screen, data) {
		let queryStr = this.getQueryStr(data);
		window.location.href = (queryStr !== '' ? '?' + queryStr : '') + '#/' + screen;
	}
};