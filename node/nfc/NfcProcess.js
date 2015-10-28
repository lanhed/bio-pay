'use strict';

const _ = require('lodash');

const EventEmitter = require('events').EventEmitter;
const MessageCodes = require('./message-codes');
const ErrorCodes = require('./error-codes');

class NfcProcess extends EventEmitter {
	constructor(connection, message) {
		super();

		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});

		this.connection = connection;
		this.message = message;

		this.data = "";

		_.bindAll(this, 'onData', 'onError', 'onClose');
		this.connection.on('data', this.onData);
		this.connection.on('error', this.onError);
		this.connection.on('close', this.onClose);

		this.connection.write(this.message + MessageCodes.endCharacter);
	}

	destroy() {
		console.info('Destroying NfcProcess');
		this.connection.removeListener('data', this.onData);
		this.connection.removeListener('error', this.onError);
		this.connection.removeListener('close', this.onClose);
	}

	onData(data) {
		this.update(data.trim()); // Removes \r character but a bit dangerous, needs a better solution
	}
	onError(error) {
		this.reject(error);
	}
	onClose() {
		this.reject('Connection to nfc-reader closed.');
	}

	update(data) {
		switch (data) {
			case MessageCodes.states.processing:
				this.emit('processing');
				break;
			case MessageCodes.states.ready:
				this.resolve(this.parseData(this.data));
				break;
			case MessageCodes.states.error:
				this.reject(ErrorCodes.foo); // Find error code
				break;
			default:
				this.data += data;
				break;
		}
	}

	parseData(data) {
		// hardcoded bitcoins for now
		data = data.replace('BTC:', '');
		let firstComma = data.indexOf(',');

		return {
			username: data.substr(0, firstComma),
			password: data.substr(firstComma + 1)
		};
	}

	then(fn1, fn2) {
		return this.promise.then(fn1, fn2);
	}
	catch(fn) {
		return this.promise.catch(fn);
	}
}

module.exports = NfcProcess;
