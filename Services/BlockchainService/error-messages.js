'use strict';

/**
 * Error responses from blockchain API with nicer messages for some 
 */
module.exports = {
	'pad block corrupted': 'Invalid blockchain wallet credentials', // Wrong password/user supplied
	'Error Decrypting Wallet': 'Invalid blockchain wallet credentials.', // No password supplied
	'Api Access is disabled. Enable it in Account Settings.': '',
	'API Access approval needed. Please check your email.': '',
	'You must provide an amount in satoshi': '', // No amount
	'Zero length BigInteger': '', // No value for amount
	'You must provide an address and amount': '', // 0 value for amount
};