/* jshint browser:true */
'use strict';

/**
 * MainController
 */
module.exports = function(dataService, $scope, $http) {
	dataService.async()
		.then(() => {
			let data = dataService.data();

			if (data.paymentTypes.length > 1) {
				$scope.paymentTypes = data.paymentTypes;
			} else {
				window.location.href = "/#/payment/" + data.paymentTypes[0];
			}
		});
};