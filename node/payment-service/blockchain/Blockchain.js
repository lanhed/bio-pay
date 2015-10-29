'use strict';

require('colors');

const blockchain = require('blockchain.info');
const ConfirmationServer = require('./ConfirmationServer');
const Utils = require('./bitcoin-utils');

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
					return reject(error);
				}

				resolve(data);
			});
		});
	}

	makePayment(credentials, amount, currency) {
		let wallet = new blockchain.MyWallet(credentials.username, credentials.password, credentials.password2);

		// Transform currency into satoshi
		let satoshi = Utils.btcToSatoshi(amount);


		return new Promise((resolve, reject) => {
			this.receiver.create(this.config.receiveAddress, (error, addressData) => {
				if (error) {
					return reject(error);
				}

				wallet.send({
					to: addressData.input_address,
					amount: satoshi
					// amount: amount
				}, (error, data) => {
					if (error || data.error) {
						return reject(error || data.error);
					}

					resolve(data);
				});
			});
		});
	}
};
