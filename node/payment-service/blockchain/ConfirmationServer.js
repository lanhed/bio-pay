'use strict';

require('colors');

const http = require('http');
const url = require('url');
const EventEmitter = require('events').EventEmitter;

const baseConfig = {
	confirmations: 4,
	port: 8002
};

class ConfirmationServer extends EventEmitter {
	constructor(config) {
		super();

		this.config = Object.assign({}, baseConfig, config);
		this.setupServer();
	}

	setupServer() {
		let server = this.server = http.createServer();

		server.on('request', this.onRequest.bind(this));

		server.listen(this.config.port);

		console.log(`Started ${'ConfirmationServer'.yellow} listening on port=${this.config.port}`.cyan);
	}

	onRequest(req, res) {
		console.log(`${'Request'.green} for "${req.headers.host.yellow}" at ${new Date().toISOString()}`);

		let query = url.parse(req.url, true).query;

		if (!query.input_address || !query.transaction_hash) {
			console.info('Ignoring request due to insufficient parameters');
			res.end('request ignored');
			return;
		}

		if (this.config.secret && query.secret !== this.config.secret) {
			console.info('Invalid secret passed in request');
			res.end('wrong secret');
			return;
		}

		console.log(`Query = ${JSON.stringify(query, 0, 2)}`);

		let confirmations = query.confirmations;

		if (query.test === 'true' || parseInt(confirmations, 10) >= this.config.confirmations) {
			res.end('*ok*');
			console.log('*ok*');
			this.emit('payment.confirmed', query);
		} else {
			res.end('not enough confirmations');
			console.log('not enough confirmations');
			this.emit('payment.received', query);
		}
	}
}




if (require.main === module) {
	new ConfirmationServer({
		port: 8001,
		confirmations: 4,
		secret: false
	});
}

module.exports = ConfirmationServer;
