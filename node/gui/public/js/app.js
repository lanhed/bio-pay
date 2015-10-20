'use strict';

let app = angular.module('app',[
	'ngRoute',
	'mainController'
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
		}).
		otherwise({
			redirectTo: '/'
		});
	}
);
