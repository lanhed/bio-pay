'use strict';

class StartView {
	constructor(data) {
		this.$el = $('#choose-payment');
		this.data = data;

		this.bindEvents();
	}

	bindEvents() {
		// (e) => ger mig fel scope, why?!
		this.$el.on('click', '[data-payment]', function(e) {
			// load next StartView
			console.log($(this).data('payment'));
		});
	}
}




// stored in json?
let config = {
	paymentTypes:[
		{ type: 'credit-card', name: 'Credit Card' },
		{ type: 'bitcoin', name: 'Blockchain Bitcoins'},
		{ type: 'paypal', name: 'PayPal'}
	]
};

new StartView(config);