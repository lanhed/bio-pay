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

	makePayment(type, amount, currency) {
		if (!this.paymentService.isPaymentTypeSupported(type)) {
			throw Error(`Payment type ${type} not supported.`);
		}

		return Nfc.read(type)
			.then(credentials => {
				return this.paymentService.makePayment(credentials, amount, currency);
			});
	}
};

