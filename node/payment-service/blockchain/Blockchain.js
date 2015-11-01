'use strict';

require('colors');

const blockchain = require('blockchain.info');
const ConfirmationServer = require('./ConfirmationServer');
const Utils = require('./bitcoin-utils');

const ErrorMessages = require('./error-messages');

const baseConfig = {
	receiveAddress: '',
	apiCode: null,
	callbackUrl: null,
	serverPort: 8002
};

module.exports = class Blockchain {
	constructor(config) {
		this.config = Object.assign({}, baseConfig, config);

		if (!this.config.receiveAddress) {
			throw Error('No receive address supplied to Blockchain');
		}

		if (!this.config.apiCode) {
			console.warn('No api code supplied to Blockchain, will make requests without'.yellow);
		}

		if (this.config.callbackUrl) {
			this.setupConfirmationServer();
		} else {
			console.warn('No callback url set up for Blockchain, wont listen for confirmations'.yellow);
		}

		this.setupReceiver();

		console.log(`Created Blockchain payment service with receive address: ${this.config.receiveAddress}`.yellow);
	}

	setupReceiver() {
		let callbackUrl = this.config.callbackUrl ? this.config.callbackUrl + ':' + this.config.serverPort : null;

		this.receiver = new blockchain.Receive(callbackUrl);
		
		if (this.confirmationServer) {
			this.receiver.listen(this.confirmationServer.server);
			console.log(`Set up receiver with callback url "${callbackUrl}"`.cyan);
		}
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
					return reject({
						errorType: 'blockchain-exchange-rates',
						errorMEssage: error
					});
				}

				resolve(data);
			});
		});
	}

	makePayment(credentials, amount, currency) {
		let wallet = new blockchain.MyWallet(credentials.username, credentials.password, credentials.password2);

		// Transform currency into satoshi
		let satoshi = Math.round(Utils.btcToSatoshi(amount));

		console.log('New payment requested');

		return new Promise((resolve, reject) => {
			this.receiver.create(this.config.receiveAddress, (error, addressData) => {
				if (error) {
					return reject({
						errortype: 'blockchain-payment',
						errorMessage: error
					});
				}
				console.log('Received new payment address');

				wallet.send({
					to: addressData.input_address,
					amount: satoshi
				}, (error, data) => {
					// Error in http-request
					if (error) {
						return reject({
							errorType: 'blockchain-payment',
							errorMessage: error
						});
					}

					// Error response from API
					if (data.error) {
						let errorMessage = ErrorMessages[data.error] || data.error;
						return reject({
							errorType: 'blockchain-payment',
							errorMessage: errorMessage
						});
					}

					resolve(data);
				});
			});
		});
	}
};
