'use strict';

const serialport = require('serialport');

const config = {
	baud: 115200,
	// parse
};


console.log('Listing ports');
serialport.list((err, ports) => {
	if (err) {
		throw err;
	}

	let port = ports[0];
	if (!port) {
		throw 'No nfc reader detected';
	}

	console.log(port);

	let connection = new serialport.SerialPort(port.comName, {
		baudrate: config.baud
	});


	connection.on('open', () => {
		console.log('Serialport opened');


		// connection.write('H')
	});

	connection.on('data', data => {
		console.log(data.toString('utf8'));
	});

});




