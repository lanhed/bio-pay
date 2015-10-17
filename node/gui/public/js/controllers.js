'use strict';

var app = angular.module('app',[]);

app.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

app.controller('PaymentSelectionController', function($scope) {
	$scope.paymentTypes:[
		{ type: 'credit-card', name: 'Credit Card' },
		{ type: 'bitcoin', name: 'Blockchain Bitcoins'},
		{ type: 'paypal', name: 'PayPal'}
	]
})