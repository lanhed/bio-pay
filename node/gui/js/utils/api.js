
module.exports = {
	baseUrl: '/api',

	getJSON($http, method) {
		return $http.get(`${this.baseUrl}/${method}`);
	}
};