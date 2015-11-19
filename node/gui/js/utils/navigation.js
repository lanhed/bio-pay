'use strict';

const dataService = require('../services/dataService');

module.exports = {
	navigate(screen, data) {
		dataService.setData(data);
		window.location = '/#/' + screen;
	}
};