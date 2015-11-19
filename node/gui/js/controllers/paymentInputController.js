'use strict';

const navigation = require('../utils/navigation');

/**
 * Payment Input Controller
 */
module.exports = function($scope, dataService, exchangeRateService) {
	let currency = 'EUR';
	let integerValue = '';
	let decimalValue = '';
	let isDecimal = false;

	function renderOutput() {
		if (!exchangeRateService.rates) {
			return;
		}

		let value = getValue();
		let bitcoinsValue = getValueInBitcoins();
		let currencySymbol = exchangeRateService.currencySymbol(currency);

		$scope.price = value.toFixed(2) + ' ' + currencySymbol;
		$scope.convertedPrice = 'BTC: ' + (bitcoinsValue || 0).toFixed(5);
	}
	function getValue() {
		return parseFloat(`${integerValue || '0'}.${decimalValue || '00'}`);
	}
	function getValueInBitcoins() {
		return exchangeRateService.convertToBitcoins(getValue(), currency);
	}


	$scope.numberClickHandler = (value) => {
		if (isDecimal) {
			decimalValue += value;
		} else {
			integerValue += value;
		}

		renderOutput();
	};

	$scope.decimalClickHandler = () => {
		isDecimal = true;
		renderOutput();
	};

	$scope.cancelClickHandler = () => {
		// show alert/modal => 'Cancel payment? yes/no'
		navigation.navigate('');
	};

	$scope.eraseClickHandler = () => {
		integerValue = decimalValue = '';
		isDecimal = false;
		renderOutput();
	};

	$scope.confirmClickHandler = () => {
		navigation.navigate('read-nfc', {
			type: dataService.get('type'),
			amount: getValueInBitcoins(),
			currency: 'BTC'
		});
	};

	exchangeRateService.on('rates.updated', renderOutput);

	renderOutput();
};
