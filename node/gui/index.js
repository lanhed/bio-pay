'use strict';

const GUIServer = require('./GUIServer');

new GUIServer({

	// Dummy responds to api
	makePayment() {
		return new Promise((resolve, reject) => {
			if (Math.random() < 0.1) {
				return reject('Request was randomly rejected');
			}

			resolve('Payment successful');
		});
	}
});
