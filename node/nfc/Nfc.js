'use strict';

require('colors');

const serialport = require('serialport');
const NfcProcess = require('./NfcProcess');
const MessageCodes = require('./message-codes');


//
// Debug data
//
// const Debug = require('../utils/Debug');
// const debugData = Debug.getJSON('nfc');


const baseConfig = {
	baudrate: 115200,
	dataSeparator: ',',
	encoding: 'utf8'
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
			encoding: this.config.encoding,
			parser: serialport.parsers.readline(MessageCodes.parseCharacter)
		});

		connection.on('open', this.onOpen.bind(this));
		connection.on('data', this.onData.bind(this));
		connection.on('error', this.onError.bind(this));
		connection.on('close', this.onClose.bind(this));
	}

	// 
	// Serial port event handlers
	// 
	onData(data) {
		console.info(`${data}`.cyan);

		/*if (this.nfcProcess) {
			this.nfcProcess.update(data);
		}*/
	}

	onError(error) {
		console.log('Error from serialport'.cyan);
		console.error(error);

		/*if (this.nfcProcess) {
			this.nfcProcess.reject(error);
		}*/
	}

	onOpen() {
		console.log('Connection to nfc-reader open'.cyan);
	}

	onClose() {
		console.log('Connection to nfc-reader closed'.cyan);
	}



	createProcess(message) {
		if (this.nfcProcess) {
			throw 'Another process already active';
		}

		let nfcProcess = this.nfcProcess = new NfcProcess(this.connection, message);
		
		let destroy = () => {
			this.nfcProcess.destroy();
			this.nfcProcess = null;
		};
		nfcProcess
			.then(destroy)
			.catch(destroy);
		
		return nfcProcess;
	}


	_write(message) {
		this.serialport.write(message + this.config.endCharacter);
	}


	/**
	 * read
	 * @param {String} type  Type of nfc data to read
	 */
	read(type) {
		let message = MessageCodes.types[type];
		
		if (!message) {
			throw `Message type: ${type} not supported`;
		}

		if (!this.connection) {
			throw 'No connection set up for nfc-reader';
		}

		if (!this.connection.isOpen()) {
			throw 'Connection to nfc-reader isn\t open yet';
		}

		let nfcProcess = this.createProcess(message);

		// this._write(message);

		return nfcProcess;
	}
};
