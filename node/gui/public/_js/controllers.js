'use strict';

let appControllers = angular.module('appControllers', []);

appControllers.controller('mainController', (dataService,$scope,$http) => {

	dataService.async().then(function() {
		let d = dataService.data();
		if (d.paymentTypes.length > 1) {
			$scope.paymentTypes = d.paymentTypes;
		} else {
			window.location.href="/#/payment/"+d.paymentTypes[0];
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
			window.location.href="/#/read-nfc";
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
});

appControllers.controller('readNfcController', () => {
	let i = 0;
	let el = $('#read-nfc').find('.read-tag');
	let header = el.find('h2');
	let interval = setInterval(() => {
		if (i === 0) {
			el.addClass('animate');
		} else if (i === 1) {
			el.removeClass('animate').addClass('read');
			header.html('Hold still');
		} else if (i === 2) {
			el.removeClass('read').addClass('done');
			header.html('Reading complete, processing payment.');
		} else {
			clearInterval(interval);
			window.location.href="/#/confirm";
		}

		i++;
	},7500);
	// visa animation när läsaren är redo att skanna
	// visa animation när tag börjar skannas
	// visa animation när tag skannats klart
	// visa errormeddelande ifall något går fel
});

appControllers.controller('confirmationController', () => {

});

appControllers.controller('paymentErrorController',() => {

});