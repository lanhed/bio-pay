'use strict';

const BlockChain = require('./BlockChain');
const Debug = require('../../utils/Debug');

const utils = require('./bitcoin-utils');


let blockChain = new BlockChain(Object.assign(Debug.getJSON('blockChain'), {
	serverPort: 8001
}));

let credentials = Debug.getJSON('nfc').bitcoins;

// Exchange rates
/*blockChain.getExchangeRates()
	.then(data => {
		console.log(data);
	})
	.catch(error => {
		console.error(error);
	});*/

// Payment
console.log('Payment', credentials);
blockChain.makePayment(credentials, utils.btcToSatoshi(0.0005))
	.then(data => {
		console.log(data);
		console.log(new Date().toISOString());
	})
	.catch(error => {
		console.error('ERROR');
		console.error(error);
	});
