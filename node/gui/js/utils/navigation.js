'use strict';

// let payment = require('../payment');
const dataService = require('../services/dataService');

module.exports = {
	navigate(screen, data) {
		dataService.setData(data);
		// payment.active = data;
		window.location = '/#/' + screen;
	}
};