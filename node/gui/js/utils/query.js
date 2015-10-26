'use strict';

let payment = require('../payment');

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
	},

	/**
	 * Parse a query string and turn in to object where key is queryName and value is queryValue or 'true' if no value specified.
	 *
	 * @param  {String} queryStr  Query string to parse.
	 * @return {Object}           Resulting object after parsing query string.
	 */
	parseQuery: function(queryStr) {
		var queries = {};
		var queryArr = queryStr.split('&');

		for (var i = 0, len = queryArr.length; i < len; i++) {
			var split = queryArr[i].split('=');

			var name = split[0];
			var value = split[1];

			if (value === undefined) {
				// All values should be of type String to keep consistency
				value = 'true';
			}

			queries[name] = value;
		}

		return queries;
	},

	/**
	 * Returns the value of queryName from the pages URL.
	 * Returns undefined if not found.
	 *
	 * @param  {String} queryName   Name of query to fetch.
	 * @return {String/undefined}   Returns the value as a string or undefined if not found.
	 */
	getQuery: function(queryName) {
		/*var queries = this.parseQuery(window.location.search.substr(1));

		return queries[queryName];*/

		return payment.active ? payment.active[queryName] : null;
	}
};