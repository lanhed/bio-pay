(function() {
	var app = angular.module('bioPay', []);

	var data = {
		paymentTypes:[
			{ type: 'credit-card', name: 'Credit Card' },
			{ type: 'bitcoin', name: 'Blockchain Bitcoins'},
			{ type: 'paypal', name: 'PayPal'}
		]
	}

	app.controller('PaymentSelectionController', function() {
		this.data = config;
	});
})();