/* jshint browser:true */
'use strict';

var $ = require('jquery');

module.exports = function() {
	let i = 0;
	let el = $('#read-nfc').find('.read-tag');
	let header = el.find('h2');
	let interval = setInterval(() => {
		if (i === 0) {
			el.addClass('animate');
		} else if (i === 1) {
			el.removeClass('animate').addClass('read');
			header.html('Hold still');
		} else if (i === 2) {
			el.removeClass('read').addClass('done');
			header.html('Reading complete, processing payment.');
		} else {
			clearInterval(interval);
			window.location.href="/#/confirm";
		}

		i++;
	},7500);
	// visa animation när läsaren är redo att skanna
	// visa animation när tag börjar skannas
	// visa animation när tag skannats klart
	// visa errormeddelande ifall något går fel
};