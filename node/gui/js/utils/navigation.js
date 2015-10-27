'use strict';

// const query = require('./query');
let payment = require('../payment');

module.exports = {
	navigate(screen, data) {
		// let queryStr = query.getQueryString(data);
		// window.location.href = (queryStr !== '' ? '?' + queryStr : '') + '#/' + screen;

		payment.active = data;
		window.location = '/#/' + screen;
	}
};