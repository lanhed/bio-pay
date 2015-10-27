/* jshint browser:true */
'use strict';

const navigation = require('../utils/navigation');
// const query = require('../utils/query');

/**
 * Payment Input Controller
 */
module.exports = function($scope, dataService) {
	let inputValue = 0;
	let inputDecimalValue = 0;
	let isDecimal = false;
	let conversionRate = 1;
	// let decimalSettings = app.paymentConfiguration.type === 'bitcoin' ? 5 : 2;
	let decimalSettings = 5;

	// let type = query.getQuery('type');
	let type = dataService.get('type');

	$scope.buttonPressHandler = (char) => {
		if (char === '.') {
			isDecimal = true;
		} else if (char === 'x') {
			// cancel
			// show alert/modal => 'Cancel payment? yes/no'
		} else if (char === '<') {
			// erase
			// reset amount
			isDecimal = false;
			inputValue = 0;
			inputDecimalValue = 0;
			$scope.price = 0;
			$scope.convertedPrice = 'SEK' + 0;
		} else if (char === 'o') {
			// send
			// save amount
			navigation.navigate('read-nfc', {
				type: type,
				amount: $scope.price,
				currency: 'TBD'
			});
		} else {
			if (!isDecimal) {
				inputValue *= 10;
				inputValue += char;
				$scope.price = inputValue;
			} else {
				inputDecimalValue *= 10;
				inputDecimalValue += char;

				let outputDecimalValue = inputDecimalValue;
				while(outputDecimalValue > 1) {
					outputDecimalValue = outputDecimalValue / 10;
				}
				$scope.price = (inputValue + outputDecimalValue).toFixed(decimalSettings);
			}

			$scope.convertedPrice = 'SEK ' + $scope.price * conversionRate;
		}
	};
};
