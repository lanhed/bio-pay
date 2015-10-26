/* jshint browser:true */
/* globals io */
'use strict';

var $ = require('jquery');

var api = require('../utils/api');
var navigation = require('../utils/navigation');
var query = require('../utils/query');


var socket = io.connect();
socket.on('nfc.reading', () => {
	setUIState('reading');
});


function setUIState(state) {
	let $el = $('#read-nfc').find('.read-tag');

	$el.removeClass('ready reading payment');

	switch (state) {
		case 'ready':
			$el.addClass('ready');
			break;
		case 'reading':
			$el.addClass('reading');
			break;
		case 'payment':
			$el.addClass('payment');
			break;
	}
}


module.exports = function($http) {
	let type = query.getQuery('type');
	let amount = query.getQuery('amount');
	let currency = query.getQuery('currency');

	setUIState('ready');

	api.get($http, `nfc/${type}`)
		.then(res => {
			setUIState('payment');
			
			let data = res.data;

			return api.post($http, `payment/${type}`, {
				username: data.username,
				password: data.password,
				amount,
				currency
			});
		})
		.then(result => {
			navigation.navigate('confirm');
			/*if (result.success) {
			} else {
				navigation.navigate('error', {
					error: result.error
				});
			}*/

		})
		.catch(error => {
			navigation.navigate('error', {
				error
			});
		});



	// let i = 0;
	// let el = $('#read-nfc').find('.read-tag');
	// let header = el.find('h2');
	// let interval = setInterval(() => {
	// 	if (i === 0) {
	// 		el.addClass('animate');
	// 	} else if (i === 1) {
	// 		el.removeClass('animate').addClass('read');
	// 		header.html('Hold still');
	// 	} else if (i === 2) {
	// 		el.removeClass('read').addClass('done');
	// 		header.html('Reading complete, processing payment.');
	// 	} else {
	// 		clearInterval(interval);
	// 		navigation.navigate('confirm');
	// 	}

	// 	i++;
	// },7500);
	// visa animation när läsaren är redo att skanna
	// visa animation när tag börjar skannas
	// visa animation när tag skannats klart
	// visa errormeddelande ifall något går fel
};