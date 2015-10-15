'use strict';

const Blockchain = require('./blockchain/Blockchain');

module.exports = class PaymentService {
	constructor() {
		this.setupPaymentServices();
	}

	setupPaymentServices() {
		this.paymentServices = {
			bitcoins: new Blockchain()
		};
	}

	isPaymentTypeSupported(type) {
		return !!this.paymentServices[type];
	}


	makePayment(type, credentials, amount, currency) {
		let service = this.paymentServices[type];

		if (!service) {
			throw Error('Unsupported payment type passed in to makePayment');		
		}

		return service.makePayment(credentials, amount, currency);
	}
};
