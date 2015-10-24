'use strict';

require('./app');

/*

App
	screens:
		start:
			data:
				exchange-rates?
			render:
				payment options
				nav => new payment -> input-amount-screen
			communication:
				supported payments
				exchange-rate
			errors:
				no exchange rate

		input-amount:
			data:
				exchange-rate
				currency
				amount
			render:
				amount
				exchanges
				currency
				keypad
				nav => cancel -> start
				nav => accept -> read-nfc
			communication:
				exchange-rate
			errors:
				exchange-rate

		read-nfc:
			data:
				data type
			render:
				states:
					reading
					error
					redo
					done
				logo
				progress animation
				nav => cancel -> start
			communication:
				read nfc
			error:
				no data of type
				error reading
				internal server error

		process-payment:
			data:
				credentials
				amount
				currency
			render:
				status - animation
				success
				errors
			communication:
				make payment
			errors:
				payment error
				internal server error

 */
