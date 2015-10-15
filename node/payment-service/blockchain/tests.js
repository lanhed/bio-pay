'use strict';

var blockchain = require('blockchain.info');

var wallet = require('./test/wallet');
var Debug = require('../../utils/Debug');

var config = Debug.getJSON('blockchain');
/**
 * 	{
 * 		receiveAddress: '',
 * 		callbackUrl: ''
 *  }
 */

function printExchangeRate(amount, currency) {
	currency = currency || 'USD';

	blockchain.exchangeRates.toBTC(amount, currency, (error, data) => {
		if (error) {
			return console.error(error);
		}
		console.log(`${amount} ${currency} is equal to ${data} BTC`);
	});
}

function printBalance(guid, password) {
	var wallet = new blockchain.MyWallet(guid, password);

	wallet.getBalance((error, data) => {
		if (error) {
			return console.error(error);
		}
		console.log(`Balance for ${guid} is ${data} satoshi`);
	});
}

function makeTransfer(wallet, to, amount) {
	var receive = new blockchain.Receive(config.callbackUrl);

	receive.create(to, (error, data) => {
		if (error) {
			return console.error(error);
		}

		console.log(data);

		wallet.send({
			to: data.input_address,
			inBTC: true,
			amount: amount
		}, (error, data) => {
			if (error) {
				return console.error(error);
			}
			console.log(data);
		});
	});
}

// 0.0005


printExchangeRate(100, 'SEK');
printBalance(wallet.guid, wallet.pwd);

// makeTransfer(new blockchain.MyWallet(wallet.guid, wallet.pwd), config.receiveAddress, 0.0005);
