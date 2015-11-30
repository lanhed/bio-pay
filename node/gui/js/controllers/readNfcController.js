/* globals io */
'use strict';

var $ = require('jquery');

var api = require('../utils/api');
var navigation = require('../utils/navigation');


var socket = io.connect();
socket.on('nfc.reading', () => {
	setUIState('reading');
});


function setUIState(state) {
	let $el = $('#read-nfc').find('.read-tag');
	let $header = $el.find('h2');

	let sndRead = new Audio("sounds/read.wav");
	let sndDone = new Audio("sounds/complete.wav");

	$el.removeClass('ready reading payment');

	switch (state) {
		case 'ready':
			$el.addClass('ready');
			break;
		case 'reading':
			$el.addClass('reading');
			$header.html('Hold still');
			sndRead.play();
			break;
		case 'payment':
			$el.addClass('payment');
			$header.html('Reading complete, processing payment.');
			sndDone.play();
			break;
	}
}


module.exports = function($http, dataService) {
	let type = dataService.get('type');
	let amount = dataService.get('amount');
	let currency = dataService.get('currency');

	let sndError = new Audio("sounds/fail.wav");

	setUIState('ready');

	api.get($http, `nfc/${type}`)
		.then(res => {
			setUIState('payment');
			
			let data = res.data;
			console.log('Read data from nfc chip', data);

			return api.post($http, `payment/${type}`, {
				// username: data.username,
				// password: data.password,
				tagId: data.tagId,
				credentials: encodeURIComponent(data.credentials),
				amount,
				currency
			});
		})
		.then(result => {
			console.log('Payment result', result);
			
			navigation.navigate('confirm');
		})
		.catch(error => {
			sndError.play();
			navigation.navigate('error', error.data);
		});
};