'use strict';

const path = require('path');

const express = require('express');
const expressHbs = require('express3-handlebars');
const sassMiddleware = require('node-sass-middleware');

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

		this.setupApp();
		this.setupRouting();
		this.setupApi();

		this.app.listen(this.config.port);
	}

	//
	// Setup
	//
	setupApp() {
		let app = this.app;

		app.set('views', path.join(__dirname, 'views'));
		app.engine('hbs',expressHbs({extname:'hbs', defaultLayout:'main'}));
		app.set('view engine', 'hbs');

		//// Sass
		app.use(sassMiddleware({
			src: path.join(__dirname, 'sass'),
			dest: path.join(__dirname, this.config.public),
			debug: true
		}));
		//// Static
		app.use(express.static(path.join(__dirname, this.config.public)));
	}

	//
	// Routing
	// 
	setupRouting() {
		let app = this.app;

		app.get('/', (req, res) => {
			res.render('home');
		});
		app.get('/payment', (req, res) => {
			res.render('payment');
		});
	}

	//
	// Api
	//
	setupApi() {
		let app = this.app;

		app.get('/api/payment/:type', (req, res) => {
			const type = req.params.type;
			const amount = req.query.amount;
			const currency = req.query.currency;

			if (!type || !amount || !currency) {
				return res.status(400).end(`Need to supply type, amount > 0.0 and currency.`);
			}

			this.paymentApp.makePayment(type, amount, currency)
				.then((result) => {
					console.log(result);
					res.end(result);
				})
				.catch((error) => { throw error; });
		});
	}
}
