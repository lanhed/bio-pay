'use strict';

const Blockchain = require('./blockchain/Blockchain');
const _  = require('lodash');

module.exports = class PaymentService {
	constructor() {
		this.setupPaymentServices();
	}

	setupPaymentServices() {
		this.paymentServices = {
			bitcoins: new Blockchain()
		};
	}

	getSupportedPaymentServices() {
		return _.map(this.paymentServices, (__, name) => name);
	}

	isPaymentTypeSupported(type) {
		return !!this.paymentServices[type];
	}


	getExchangeRates(type) {
		let service = this.paymentServices[type];

		if (!service) {
			throw Error('Unsupported payment type passed in to makePayment');		
		}

		return service.getExchangeRates(); 
	}


	makePayment(type, credentials, amount, currency) {
		let service = this.paymentServices[type];

		if (!service) {
			throw Error('Unsupported payment type passed in to makePayment');		
		}

		return service.makePayment(credentials, amount, currency);
	}
};
