'use strict';

const BlockChain = require('../BlockChain');
const Settings = require('../../../utils/Settings');

// const BitcoinUtils = require('../BitcoinUtils');

const paymentServiceData = Settings.getJSON('payment-services');
const blockchainUserData = Settings.getJSON('tests/blockchain-user');

const localBlockchainData = paymentServiceData.bitcoins;

const blockchain = new BlockChain({
	oldReceiveAddress: localBlockchainData.oldReceiveAddress,
	apiV2Code: localBlockchainData.apiV2Code,
	xPub: '-'
});


//
// Exchange rates
//
blockchain.getExchangeRates()
	.then(rates => console.log(rates.SEK))
	.catch(console.error.bind(console));


//
// Payment
//
const credentials = blockchainUserData;
const amount = 0.0005; // BTC
blockchain.makePayment(credentials, amount)
	.then(data => {
		console.log(data);
	})
	.catch(console.error.bind(console));



// Exchange rates
/*blockChain.getExchangeRates()
	.then(data => {
		console.log(data);
	})
	.catch(error => {
		console.error(error);
	});*/

// Payment
// console.log('Payment', credentials);
// blockChain.makePayment(credentials, utils.btcToSatoshi(0.0005))
// 	.then(data => {
// 		console.log(data);
// 		console.log(new Date().toISOString());
// 	})
// 	.catch(error => {
// 		console.error('ERROR');
// 		console.error(error);
// 	});
