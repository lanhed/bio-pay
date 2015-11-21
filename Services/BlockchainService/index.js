'use strict';

const Server = require('./Server');

let server = new Server({
	blockchain: {
		callbackUrl: 'http://84.55.85.15'
	}
});

server.start();
