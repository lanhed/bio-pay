
const query = require('./query');

module.exports = {
	baseUrl: '/api',

	get($http, method, data) {
		return this.request($http, 'get', `${this.baseUrl}/${method}`, data);
	},

	post($http, method, data) {
		return this.request($http, 'post', `${this.baseUrl}/${method}`, data);
	},

	request($http, type, method, data) {
		var queryStr = query.getQueryString(data);

		return $http[type](method + (queryStr !== '' ? '?' + queryStr : ''));
	}
};