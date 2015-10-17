'use strict';

var app = angular.module('app',[]);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

app.controller('PaymentSelectionController', function($scope,$http) {
	$http.get('data/store-config.json').success(function(data) {
		if (data.paymentTypes.length > 1) {
			$scope.paymentTypes = data.paymentTypes;
		} else {
			// route to next view
		}
	});
});