'use strict';

var angular = require('angular');
require('angular-route');

// Controllers
require('./controllers/appControllers');

const navigation = require('./utils/navigation');

let app = angular.module('app',[
	'ngRoute',
	'appControllers'
]);

app.config(($interpolateProvider) => {
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

app.config(($routeProvider) => {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'mainController'
		})

		.when('/payment', {
			templateUrl: 'views/payment.html',
			controller: 'paymentInputController'
		})

		.when('/read-nfc', {
			templateUrl: 'views/read-nfc.html',
			controller: 'readNfcController'
		})

		.when('/confirm',{
			templateUrl: 'views/confirmation.html',
			controller: 'confirmationController'
		})

		.when('/error',{
			templateUrl: 'views/payment-error.html',
			controller: 'paymentErrorController'
		})

		.otherwise({
			redirectTo: '/'
		});
	}
);

app.factory('dataService', () => require('./services/dataService'));
app.factory('exchangeRateService', require('./services/exchangeRateService'));

navigation.navigate('');

module.exports = app;
