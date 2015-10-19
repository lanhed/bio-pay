'use strict';

const PaymentService = require('./payment-service/PaymentService');
const Nfc = require('./nfc/Nfc');
const GUIServer = require('./gui/GUIServer');

module.exports = class App {

	constructor() {
		this.paymentService = new PaymentService();
		this.nfc = new Nfc();

		this.gui = new GUIServer(this);
	}

	getPaymentServices() {
		return this.paymentService.getSupportedPaymentServices();
	}

	getExchangeRates(type) {
		return this.paymentService.getExchangeRates(type);
	}

	readNfc(type) {
		return this.Nfc.read(type);
	}

	makePayment(type, credentials, amount, currency) {
		return this.paymentService.makePayment(credentials, amount, currency);
	}
};

