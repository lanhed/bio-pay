'use strict';

module.exports = {
	getQueryString: function(data) {
		let queries = [];

		if (data) {
			for (let key in data) {
				if (!data.hasOwnProperty(key)) continue;

				queries.push(`${key}=${data[key]}`);
			}
		}

		return queries.join('&');
	}
};