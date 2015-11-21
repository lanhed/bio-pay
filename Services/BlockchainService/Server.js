'use strict';

require('colors');

const express = require('express');
const Blockchain = require('./Blockchain');
const Crypt = require('./crypto/Crypt');


const baseConfig = {
	port: 3000
};

module.exports = class Server {
	constructor(config) {
		this.config = Object.assign({}, baseConfig, config);

		this.setupExpress();
		this.setupBlockchain();
		this.setupCrypt();
	}

	start() {
		this.app.listen(this.config.port);
		console.log(`Started BlockchanService server at port:${this.config.port}`.green);
	}

	setupExpress() {
		this.app = express();
		this.setupApi();
	}

	setupCrypt() {
		this.crypt = new Crypt(this.config.crypt);
	}

	setupBlockchain() {
		this.blockchain = new Blockchain(this.config.blockchain);
	}

	setupApi() {
		const app = this.app;

		app.get('/walletTsx', (req, res) => {

			const credentials = req.query.credentials; // Encrypted
			const tagId = req.query.tagId;
			const receiveAddress = req.query.receiveAddress;
			const amount = req.query.amount;

			if (!credentials || !tagId || !amount || !receiveAddress) {
				console.error(req.query);
				return res.status(400).end(`Need to supply credentials, tagId, amount > 0.0 and receive address.`);
			}

			let transaction = {
				wallet: {},
				receiveAddress: receiveAddress,
				amount: amount // in BTC
			};

			this.crypt.getWalletCredentials(credentials, tagId)
				.then(wallet => {
					console.log(wallet);
					Object.assign(transaction.wallet, wallet);
					return this.blockchain.makeWalletTransaction(transaction);
				})
				.then(result => {
					console.log('Payment result', result);
					res.json(result);
				})
				.catch(error => {
					console.error('Payment error', error);
					res.status(500).json(error);
					res.end();
				});
		});
	}

};
