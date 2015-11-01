'use strict';

const navigation = require('../utils/navigation');

module.exports = function() {
	setTimeout(() => {
		navigation.navigate('/');
	}, 4000);
};