'use strict';
let appControllers = angular.module('mainController', []);

appControllers.controller('mainController', ($scope,$http) => {
	$http.get('data/store-config.json').success((data) => {
		if (data.paymentTypes.length > 1) {
			$scope.paymentTypes = data.paymentTypes;
		} else {
			// only one payment type, no need to display the view, move on...
			window.location.href="/#/payment/"+data.paymentTypes[0];
		}
	});
});

appControllers.controller('paymentInputController', ($scope) => {
	let inputValue = 0;
	let inputDecimalValue = 0;
	let isDecimal = false;
	let conversionRate = 1;
	let decimalSettings = app.paymentConfiguration.type === 'bitcoin' ? 5 : 2;
	$scope.buttonPressHandler = (char) => {
		if (char === '.') {
			isDecimal = true;
		} else if (char === 'x' || char === '<' || char === 'o') {
			//
		} else {
			if (!isDecimal) {
				inputValue *= 10;
				inputValue += char;
				$scope.price = inputValue;
			} else {
				inputDecimalValue *= 10;
				inputDecimalValue += char;
				//inputDecimalValue / 100;
				let outputDecimalValue = inputDecimalValue;
				while(outputDecimalValue > 1) {
					outputDecimalValue = outputDecimalValue / 10;
				}
				$scope.price = (inputValue + outputDecimalValue).toFixed(decimalSettings);
			}

			$scope.convertedPrice = 'SEK ' + $scope.price * conversionRate;
		}
	};
});