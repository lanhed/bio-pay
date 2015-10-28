'use strict';

const Nfc = require('./Nfc');

let nfc = new Nfc();

setTimeout(() => {
	nfc.read('bitcoins')
		.on('processing', () => { console.log('processing'); })
		.then(result => {
			console.log('result', result);
		})
		.catch(error => {
			console.log('Catched', error);
		});
}, 2000);
