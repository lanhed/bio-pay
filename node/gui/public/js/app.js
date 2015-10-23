'use strict';

let app = angular.module('app',[
	'ngRoute',
	'appControllers'
]);

app.paymentConfiguration = {
	type:null,
	value:0
};

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

		.when('/payment/:type', {
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

app.factory('dataService', ($http, $q) => {
	let deferred = $q.defer();
	let data = [];
	let paymentConfiguration = {
		type:null,
		value:0
	};
	let service = {};

	service.async = () => {
		$http.get('data/store-config.json').success((d) => {
			data = d;
			deferred.resolve();
		});

		return deferred.promise;
	};

	service.data = () => { return data; }
	
	service.currentPayment = (options) => {
		//if option save
	}

	return service;
});