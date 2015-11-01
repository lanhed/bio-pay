'use strict';

const EventEmitter = require('events').EventEmitter;
const Api = require('../utils/api');

module.exports = ($http) => {
	const refreshRate = 30 * 1000;
	this.rates = null;


	this._getCurrencyRate = (currency) => {
		if (!this.rates) {
			return null;
		}

		let currencyRate = this.rates[currency];
		if (!currencyRate) {
			return null;
		}

		return currencyRate;
	};

	this.convertToBitcoins = (amount, currency) => {
		let currencyRate = this._getCurrencyRate(currency);
		if (currencyRate === null) {
			return null;
		}

		return amount / currencyRate["15m"];
	};

	this.currencySymbol = (currency) => {
		let currencyRate = this._getCurrencyRate(currency);
		if (currencyRate === null) {
			return null;
		}

		return currencyRate["symbol"];
	};

	this.fetchExchangeRates = () => {
		Api.get($http, 'exchange-rates')
			.then((res) => {
				if (res.data) {
					this.rates = res.data;
					this.emit('rates.updated');
				}
			});
	};

	setInterval(() => { this.fetchExchangeRates(); }, refreshRate);
	this.fetchExchangeRates();

	Object.assign(this, EventEmitter.prototype);
	return this;
};


