'use strict';

const blockchain = require('blockchain.info');
const ConfirmationServer = require('./ConfirmationServer');

const baseConfig = {
	receiveAddress: '',
	apiCode: null,
	callbackUrl: '',
	serverPort: 8002
};

module.exports = class Blockchain {
	constructor(config) {
		this.config = Object.assign({}, baseConfig, config);

		// this.setupConfirmationServer();
		this.setupReceiver();
	}

	setupReceiver() {
		let callbackUrl = this.config.callbackUrl + ':' + this.config.serverPort;

		this.receiver = new blockchain.Receive(callbackUrl);
		// this.receiver.listen(this.confirmationServer.server);
		
		console.log(`Set up receiver with callback url "${callbackUrl}"`);
	}

	setupConfirmationServer() {
		this.confirmationServer = new ConfirmationServer({
			port: this.config.serverPort
		});
	}

	getExchangeRates() {
		return new Promise((resolve, reject) => {
			blockchain.exchangeRates.getTicker((error, data) => {
				if (error) {
					return reject(error);
				}

				resolve(data);
			});
		});
	}

	makePayment(credentials, amount, currency) {
		let wallet = new blockchain.MyWallet(credentials.username, credentials.password, credentials.password2);

		// Transform currency into satoshi

		return new Promise((resolve, reject) => {
			this.receiver.create(this.config.receiveAddress, (error, addressData) => {
				if (error) {
					return reject(error);
				}

				wallet.send({
					to: addressData.input_address,
					amount: amount
				}, (error, data) => {
					if (error) {
						return reject(error);
					}

					resolve(data);
				});
			});
		});
	}
};
