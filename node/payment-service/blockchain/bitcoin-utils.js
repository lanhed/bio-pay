'use strict';

module.exports = {
	btcToSatoshi(amount) {
		return amount * 100000000;
	},

	satoshiToBtc(amount) {
		return amount * 0.00000001;
	}
};
