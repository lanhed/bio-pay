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
		this.reject({
			errorType: 'serialport',
			errorMessage: error
		});
	}
	onClose() {
		this.reject({
			errorType: 'serialport',
			errorMessage: 'Connection to nfc-reader closed.'
		});
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
				this.reject({
					errorType: 'nfc-read',
					errorMessage: ErrorCodes.foo // Find error code
				});
				break;
			
			default:
				this.data += data;
				break;
		}

		console.log(`this.data: "${this.data}"`.yellow);
	}

	parseData(unparsed) {
		let firstColon = unparsed.indexOf(':');
		let dataType = unparsed.substr(0, firstColon);
		let data = unparsed.substr(firstColon + 1);

		let parsed = null;

		console.log(unparsed);

		switch (dataType) {
			case 'BTC':
				let firstComma = data.indexOf(',');
				parsed = {
					username: data.substr(0, firstComma),
					password: data.substr(firstComma + 1)
				};
				break;
			default:
				// Unknown type
				this.reject({
					error: 'nfc-read',
					errorMessage: 'Unkown data format read from nfc.'
				});
				break;
		}

		return parsed;
	}

	then(fn1, fn2) {
		return this.promise.then(fn1, fn2);
	}
	catch(fn) {
		return this.promise.catch(fn);
	}
}

module.exports = NfcProcess;
