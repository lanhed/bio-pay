'use strict';

require('colors');

const path = require('path');
const http = require('http');

const _ = require('lodash');

const express = require('express');
const sassMiddleware = require('node-sass-middleware');
const browserify = require('browserify-middleware');
const socketIo = require('socket.io');

const baseConfig = {
	public: 'public',
	port: 8001
};


module.exports = class GUIServer {

	constructor(paymentApp, config) {
		if (!paymentApp) {
			throw Error('No payment app passed to server but it\'s required.');
		}

		this.paymentApp = paymentApp;
		this.config = Object.assign({}, baseConfig, config);

		this.app = express();
		this.server = http.Server(this.app);

		this.setupApp();
		this.setupRouting();
		this.setupApi();
		this.setupSocketIO();

		this.server.listen(this.config.port);

		console.log(`GUIServer started on port=${this.config.port}`.green);
	}

	//
	// Socket IO
	//
	setupSocketIO() {
		this.io = socketIo(this.server);
	}

	broadcastSocketMessage(messageType, data) {
		let io = this.io;
		let sockets = io.sockets.sockets;

		_.each(sockets, (socket) => {
			socket.emit(messageType, data);
		});
	}


	//
	// Setup
	//
	setupApp() {
		let app = this.app;

		//// Sass
		app.use(sassMiddleware({
			src: path.join(__dirname, 'sass'),
			dest: path.join(__dirname, this.config.public),
			debug: true
		}));

		// Browserify
		browserify.settings({});
		app.get('/main.js', browserify(path.join(__dirname, 'js/main.js')));

		//// Static
		app.use(express.static(path.join(__dirname, this.config.public)));
	}

	//
	// Routing
	// 
	setupRouting() {
		let app = this.app;
		let fileName = __dirname + '/public/views/index.html';
		app.get('/', (req, res) => {
			res.sendFile(fileName,function (err) {
				if (err) {
					console.log(err);
					res.status(err.status).end();
				}
			});
		});
	}

	//
	// Api
	//
	setupApi() {
		let app = this.app;

		// Supported payment services
		app.get('/api/services', (req, res) => {
			res.json(this.paymentApp.getPaymentServices());
		});

		// Exchange rates
		app.get('/api/exchange-rates', (req, res) => {
			this.paymentApp.getExchangeRates()
				.then(data => {
					res.json(data);
				})
				.catch(error => { throw error; });
		});

		// Read nfc
		app.get('/api/nfc/:type', (req, res) => {
			const type = req.params.type;

			if (!type) {
				return res.status(400).end('Need to supply type.');
			}

			console.log(`Request for reading nfc of type=${type}`.magenta);

			let process = this.paymentApp.readNfc(type);

			process.on('processing', () => {
				this.broadcastSocketMessage('nfc.reading');
			});

			process
				.then(data => {
					res.json(data);
				})
				.catch(error => {
					console.error('Nfc read error', error);
					res.status(500).end(error);
				});
		});

		/**
		 * Payment
		 * 
		 * Queries (required):
		 * 		username
		 * 		password
		 * 		amount
		 * 		currency
		 */
		app.post('/api/payment/:type', (req, res) => {
			const type = req.params.type;
			const username = req.query.username;
			const password = req.query.password;
			const amount = req.query.amount;
			const currency = req.query.currency;

			if (!type || !username || !password || !amount || !currency) {
				console.error(req.query);
				return res.status(400).end(`Need to supply type, credentials, amount > 0.0 and currency.`);
			}

			console.log(`Request for new payment: ${JSON.stringify({type,username,password,amount,currency})}`.magenta);

			this.paymentApp.makePayment(type, { username, password }, amount, currency)
				.then((result) => {
					console.log('Payment result', result);
					res.json(result);
				})
				.catch(error => {
					console.error('Payment error', error);
					res.status(500).json(error);
				});
		});
	}
};
