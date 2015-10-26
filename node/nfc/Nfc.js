'use strict';

// Debug
const Debug = require('../utils/Debug');
const serialport = require('serialport');


//
// Debug data
//
const debugData = Debug.getJSON('nfc');


const baseConfig = {
	baudrate: 115200,
	parserCharacter: '\n',
	dataSeparator: ','
};


/**
 * Nfc
 */
module.exports = class Nfc {
	constructor(config) {
		this.config = Object.assign({}, baseConfig, config);

		this.port = null;
		this.connection = null;

		this.setupSerialport();
	}

	setupSerialport() {
		serialport.list((err, ports) => {
			if (err) {
				throw err;
			}

			let port = ports[0];
			if (!port) {
				throw 'Could not find any connected arduino';
			}

			this.setupConnection(port);
		});
	}

	setupConnection(port) {
		this.port = port;
		let connection = this.connection = new serialport.SerialPort(port.comName, {
			baudrate: this.config.baudrate,
			parser: serialport.parsers.readline(this.config.parserCharacter)
		});

		connection.on('open', this.onOpen.bind(this));
		connection.on('data', this.onData.bind(this));
		connection.on('error', this.onError.bind(this));
		connection.on('close', this.onClose.bind(this));
	}

	onOpen() {

	}

	onData(data) {
	}

	onError(error) {
		console.log('Error from serialport');
		console.error(error);
	}

	onClose() {

	}




	/**
	 * read
	 * @param {String} type  Type of nfc data to read
	 */
	read(type) {
		return new Promise((resolve, reject) => {
			if (debugData[type]) {
				resolve(debugData[type]);
			} else {
				reject(`Nfc type ${type} not supported`);
			}
		});
	}
};
