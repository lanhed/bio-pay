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
		console.info('Destroying NfcProcess'.yellow);
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
	}

	parseData(unparsed) {
		let firstComma = unparsed.indexOf(',');
		
		// let tagId = unparsed.substr(0, firstComma);
		// let credentials = unparsed.substr(firstComma + 1);

		let tagId = unparsed;

		const ids = {
			// juanjo
			'0485e612ff3880': 'V9rhJrGla9jlWjIo8eaqAgAk3i+r/Ua88jQgFc6Qyeo/LaC+aAJ4Yd8ndpe029gwiTJknTTtt1LJJGqEGgg60pb/0lkcEQpJWMCjT4F7RWgAs1spyJkNDKkvW8rqZWS6ASE12rZdbMOggzNwLiM/V6jhQ+xm0t3BlUbPVE49leoC7IFy8hUJccfEdBYhJ7ERX8NWe+5bnftYQUVoX9n27lp8s/SuwFvK9Fvcvg9FcdNA8aCu7gSPHfzdWdIswrky',
			// old-tag
			'04d9c8c2613e80': 'Qup3HMm0gnfqgQsD6vCVeZkdKLHj+w9sIp8y/INP7YR603G5sQArZqkY4JWXWrBdlHDiWH2cvbHTCWPbrya5PS51Qb7tExMTZaXZ8LOpsqFSJlSFQ9/LyGUa88EZsCM3FC1aWyAp4SPGaM+TLI6CM4zn86K5ajifqsG4ojDMUPd9C/1GSO7gxGTVMx6QklecjYT9WJgStB5PiISyA5+nGruZpkpz/Ic8Jdvky+kg0QZ1CGi17X9XwpNeKm/ek/jP'
		};

		let credentials = ids[tagId];

		if (!credentials) {
			this.reject({
				error: 'nfc-read',
				errorMessage: 'Couldn\'t read the correct data from chip. Try again.'
			});
		}

		return {
			tagId,
			credentials
		};

		
		// let dataType = unparsed.substr(0, firstColon);
		// let data = unparsed.substr(firstColon + 1);

		// let parsed = null;

		// switch (dataType) {
		// 	case 'BTC':
		// 		let firstComma = data.indexOf(',');
		// 		parsed = {
		// 			username: data.substr(0, firstComma),
		// 			password: data.substr(firstComma + 1)
		// 		};
		// 		break;
		// 	default:
		// 		// Unknown type
		// 		this.reject({
		// 			error: 'nfc-read',
		// 			errorMessage: 'Couldn\'t read the correct data from chip. Try again.'
		// 		});
		// 		break;
		// }

		// console.log(`Parsed data: ${JSON.stringify(parsed)}`.yellow);

		// return parsed;
	}

	then(fn1, fn2) {
		return this.promise.then(fn1, fn2);
	}
	catch(fn) {
		return this.promise.catch(fn);
	}
}

module.exports = NfcProcess;
