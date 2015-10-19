'use strict';

let app = angular.module('app',[]);
app.paymentConfiguration = {
	type:null,
	value:0
};

app.config(($interpolateProvider) => {
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

app.controller('PaymentSelectionController', ($scope,$http) => {
	$scope.registerPaymentType = (type) => {
		app.paymentConfiguration.type = type;
		window.location.href="/#/payment/"+type;
	};

	$http.get('data/store-config.json').success((data) => {
		if (data.paymentTypes.length > 1) {
			$scope.paymentTypes = data.paymentTypes;
		} else {
			// only one payment type, no need to display the view, move on...
			window.location.href="/#/payment/"+data.paymentTypes[0];
		}
	});
});

app.controller('PaymentInputController', ($scope) => {
	let inputValue = 0;
	let inputDecimalValue = 0;
	let isDecimal = false;
	let decimalSettings = app.paymentConfiguration.type === 'bitcoin' ? 10000 : 100;
	$scope.buttonPressHandler = (char) => {
		if (char === '.') {
			isDecimal = true;
		} else if (char === '>') {
			// send input value
		} else {
			if (!isDecimal) {
				inputValue *= 10;
				inputValue += char;
				$scope.price = inputValue;
			} else {
				if (inputDecimalValue < decimalSettings) {
					inputDecimalValue *= 10;
					inputDecimalValue += char;
					$scope.price = inputValue + inputDecimalValue / 100;
				}
			}
		}
	};
});