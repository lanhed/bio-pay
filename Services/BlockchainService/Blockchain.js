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

		if (!this.config.apiCode) {
			console.warn('No api code supplied to Blockchain, will make requests without'.yellow);
		}

		if (this.config.callbackUrl) {
			this.setupConfirmationServer();
		} else {
			console.warn('No callback url set up for Blockchain, wont listen for confirmations'.yellow);
		}

		this.setupReceiver();

		console.log(`Created Blockchain payment service`);
	}

	setupReceiver() {
		let callbackUrl = this.config.callbackUrl ? this.config.callbackUrl + ':' + this.config.serverPort : 'http://0.0.0.0';

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

	makeWalletTransaction(tsx) {
		let walletCredentials = tsx.wallet;
		let receiveAddress = tsx.receiveAddress;
		let amount = tsx.amount;

		let wallet = new blockchain.MyWallet(walletCredentials.username, walletCredentials.password, walletCredentials.password2);
		let satoshi = Math.round(Utils.btcToSatoshi(amount));

		return this.createReceiveAddress(receiveAddress)
					.then(address => this.makePayment(wallet, address, satoshi));
	}

	makePayment(wallet, receiveAddress, satoshi) {
		return new Promise((resolve, reject) => {

			let payment = {
				to: receiveAddress,
				amount: satoshi
			}; 

			wallet.send(payment, (error, data) => {
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
	}

	createReceiveAddress(address) {
		return new Promise((resolve, reject) => {
			let receiver = new blockchain.Receive(this.config.callbackUrl);

			receiver.create(address, (error, addressData) => {
				if (error) {
					console.error('createReceiveAddress error');
					reject({
						errorType: 'blockchain-payment',
						errorMessage: error
					});
				} else {
					resolve(addressData.input_address);
				}
			});
		});
	}
};
