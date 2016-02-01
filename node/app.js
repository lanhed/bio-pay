'use strict';

require('colors');

const PaymentService = require('./payment-service/PaymentService');
const Nfc = require('./nfc/Nfc');
const GUIServer = require('./gui/GUIServer');

const Settings = require('./utils/settings');

module.exports = class App {

	constructor() {
		this.setupPaymentService();
		this.setupNfc();
		this.setupGui();

		console.log('*    App started   *'.rainbow.bgWhite);
		console.log('~ Yaaaaaaaaaaaaaay ~'.rainbow.bgWhite);
	}

	//
	// Setup
	//
	setupPaymentService() {
		const config = Settings.getJSON('payment-services');
		this.paymentService = new PaymentService(config);
	}

	setupNfc() {
		this.nfc = new Nfc();
	}

	setupGui() {
		this.gui = new GUIServer(this);
	}


	//
	// API access
	//
	getPaymentServices() {
		return this.paymentService.getSupportedPaymentServices();
	}

	getExchangeRates(type) {
		return this.paymentService.getExchangeRates(type);
	}

	readNfc(type) {
		return this.nfc.read(type);
	}

	makePayment(type, credentials, amount, currency) {
		return this.paymentService.makePayment(type, credentials, amount, currency);
	}
};
