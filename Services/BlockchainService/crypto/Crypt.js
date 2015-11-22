'use strict';

const NodeRSA = require('node-rsa');
const privateKey = require('./private-key');
const publicKey = require('./public-key');

const baseConfig = {
	privateKey,
	publicKey
};

module.exports = class Crypt {
	constructor(config) {
		this.config = Object.assign({}, baseConfig, config);

		this.privateKey = new NodeRSA(this.config.privateKey);
		this.publicKey = new NodeRSA(this.config.publicKey);
	}

	encrypt(text) {
		return this.publicKey.encrypt(text, 'base64');
	}

	decrypt(hash) {
		return this.privateKey.decrypt(hash, 'utf8');
	}

	getWalletCredentials(hash, salt) {
		return new Promise((resolve, reject) => {
			let decrypted = this.decrypt(hash);

			// Validate
			if (!this.isValid(decrypted, salt)) {
				return reject({
					errorType: 'crypto-error',
					errorMessage: 'Crypted text does not contain a valid salt'
				});
			}

			decrypted = this.removeSalt(decrypted, salt);
			let firstComma = decrypted.indexOf(',');

			let credentials = {
				username: decrypted.substr(0, firstComma),
				password: decrypted.substr(firstComma + 1)
			};

			resolve(credentials);
		});
	}

	addSalt(text, salt) {
		return salt + text;
	}

	removeSalt(decrypted, salt) {
		return decrypted.substr(salt.length);
	}

	isValid(decrypted, salt) {
		return decrypted.indexOf(salt) === 0;
	}
};
