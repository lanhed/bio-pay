'use strict';

require('colors');

const PaymentService = require('./payment-service/PaymentService');
const Nfc = require('./nfc/Nfc');
const GUIServer = require('./gui/GUIServer');

const Settings = require('./settings');

module.exports = class App {

	constructor() {
		this.setupPaymentService();
		this.setupNfc();
		this.setupGui();

		console.log('*    App started   *'.rainbow.bgWhite);
		console.log('~ Yaaaaaaaaaaaaaay ~'.rainbow.bgWhite);
	}

	setupPaymentService() {
		let config = Settings.readJSON('payment-services');
		this.paymentService = new PaymentService(config);
	}

	setupNfc() { this.nfc = new Nfc(); }
	setupGui() { this.gui = new GUIServer(this); }


	getPaymentServices() {
		console.log('getPaymentServices');
		return this.paymentService.getSupportedPaymentServices();
	}

	getExchangeRates(type) {
		return this.paymentService.getExchangeRates(type);
	}

	readNfc(type) {
		console.log('readNfc');
		return this.nfc.read(type);
	}

	makePayment(type, credentials, amount, currency) {
		console.log('makePayment');
		return this.paymentService.makePayment(type, credentials, amount, currency);
	}
};

