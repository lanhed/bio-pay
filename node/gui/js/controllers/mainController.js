'use strict';

const api = require('../utils/api');
const navigation = require('../utils/navigation');

/**
 * MainController
 */
module.exports = function($scope, $http) {
	api.get($http, 'services')
		.then((res) => {
			let data = res.data;

			if (data.length > 1) {
				$scope.paymentTypes = data;
			} else {
				navigation.navigate('payment', {
					type: data[0].type
				});
			}
		});
};