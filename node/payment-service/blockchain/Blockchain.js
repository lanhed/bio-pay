'use strict';

require('colors');

const blockchain = require('blockchain.info');
const ConfirmationServer = require('./ConfirmationServer');
const BitcoinUtils = require('./BitcoinUtils');
const request = require('request');

// const ErrorMessages = require('./error-messages');

const baseConfig = {
	oldReceiveAddress: null, // Only used until we get an API code for V2

	xPub: null,
	receiveApiCode: null,
	apiV2Code: null,
	apiV2HostUrl: 'http://localhost:3000',

	callbackUrl: null,
	callbackServerPort: 8002
};

module.exports = class Blockchain {
	constructor(config) {
		this.config = Object.assign({}, baseConfig, config);

		if (!this.config.xPub) {
			throw Error('No xPub address supplied to the Blockchain service');
		}

		if (!this.config.receiveApiCode && !this.config.oldReceiveAddress) {
			throw Error('No receive api code or old receive address supplied to the Blockchain service');
		}

		if (!this.config.apiV2Code) {
			throw Error('No api code V2 supplied to the Blockchain service');
		}

		if (this.config.callbackUrl) {
			this.setupConfirmationServer();
		} else {
			console.warn('No callback url set up for Blockchain, wont listen for confirmations'.yellow);
		}

		this.setupReceiver();

		console.log(`Created Blockchain payment service with xPub address: ${this.config.xPub}`.yellow);
	}

	setupReceiver() {
		const xPub = this.config.xPub;
		const receiveApiCode = this.config.receiveApiCode;
		const callbackUrl = (
			this.config.callbackUrl
			? this.config.callbackUrl + ':' + this.config.callbackServerPort
			: 'http://0.0.0.0'
		);

		this.receiver = new blockchain.Receive(xPub, callbackUrl, receiveApiCode);
	}

	setupConfirmationServer() {
		this.confirmationServer = new ConfirmationServer({
			port: this.config.callbackServerPort
		});
	}


	getExchangeRates() {
		return blockchain.exchange.getTicker().catch(error => ({
			errorType: 'blockchain-exchange-rates',
			errorMessage: error
		}));
	}

	//
	// Encrypted payment
	// Goes to a central server that decrypts the credentials and performs the payment
	//
	makeEncryptedPayment(credentials, amount/*, currency*/) {
		return new Promise((resolve, reject) => {
			const receiveAddress = this.config.receiveAddress;
			let url = this.config.serviceUrl;

			url += `/walletTsx?credentials=${encodeURIComponent(credentials.credentials)}&tagId=${credentials.tagId}&amount=${amount}&receiveAddress=${receiveAddress}`;

			console.log(url);

			request(url, (error, response, body) => {
				const parsed = JSON.parse(body);

				if (error || response.statusCode !== 200) {
					return reject(error || parsed);
				}

				resolve(parsed);
			});
		});
	}

	//
	// Unencrypted payment
	// Goes directly to payment service, credentials are cleartext
	//
	makePayment(credentials, amount/*, currency*/) {
		const amountInSatoshi = BitcoinUtils.btcToSatoshi(amount);

		const identifier = credentials.username;
		const password = credentials.password;

		const wallet = new blockchain.MyWallet(identifier, password, {
			apiCode: this.config.apiV2Code,
			apiHost: this.config.apiV2HostUrl
		});

		this.fixMyWalletParamsHack(wallet);

		return Promise.all([
				this.getReceiveAddress(),	// eslint-disable-line indent
				wallet.login()				// eslint-disable-line indent
			])								// eslint-disable-line indent
			.then(values => {
				const generatedAddress = values[0].address;
				
				console.log(`Making a new payment (BTC ${amount})`);
				return wallet.send(generatedAddress, amountInSatoshi);
			})
			.then(paymentResponse => {
				console.log(`Succesfull payment made (BTC ${amount})`, paymentResponse);
				//
				// Should log out wallet
				//
				return paymentResponse;
			})
			.catch(error => ({
				errorType: 'blockchain-payment',
				errorMessage: error
			}));		
	}

	//
	// Generates an address where coins can be transfered to
	// This abstraction method is only needed until we have an API V2 code for receiving
	//
	getReceiveAddress() {
		if (!this.config.receiveApiCode && this.config.oldReceiveAddress) {
			// Use old way, not supported after 1/1-2016
			return new Promise((resolve, reject) => {
				const url = `https://blockchain.info/api/receive?method=create&address=${this.config.oldReceiveAddress}`;

				request(url, (error, response, body) => {
					const parsed = JSON.parse(body);

					if (error || response.statusCode !== 200) {
						return reject(error || parsed);
					}

					resolve({
						address: parsed.input_address
					});
				});
			});
		}

		return this.receiver.generate();
	}

	//
	// Last version checked needed in "blockchain.info": "2.2.0"
	// 
	// MyWallet implementation sets the query parameter name for receiving addres as "address" but the API expects the query parameter name "to".
	// The MyWallet has a function called "getParams" which returns an object that the query parameters are added to.
	// We override this function and add a getter with the name "to" to the returned object that returns the value of "address".
	//
	fixMyWalletParamsHack(wallet) {
		const _getParams = wallet.getParams.bind(wallet);

		wallet.getParams = () => {
			const params = _getParams();

			Object.defineProperty(params, 'to', {
				enumerable: true,
				configurable: true,
				get() {
					return this.address;
				},
				set(value) {
					// If the "to" value is ever set, we remove our implementation and make it a regular property.
					delete this.to;
					this.to = value;
				}
			});

			return params;
		};
	}
};
