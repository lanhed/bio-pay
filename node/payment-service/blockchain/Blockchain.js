
const blockchain = require('blockchain.info');
const http = require('http');

const baseConfig = {
	apiCode: null,
	callbackUrl: '',
	serverPort: 8002
};

module.exports = class Blockchain {
	constructor() {
		this.wallet = {
			address: '14ZTswYdmX8BCPWdKnF3vh8a4P83rUfCKe'
		};

		this.setupConfirmationServer();
		this.setupReceiver();
	}

	setupReceiver() {
		this.receiver = new blockchain.Receive(baseConfig.callbackUrl);
		this.receiver.listen(this.confirmationServer);
	}

	setupConfirmationServer() {
		let server = this.confirmationServer = http.createServer();
		
		server.on('request', (req, res) => {
			res.end('*ok*');
		});

		server.listen(baseConfig.serverPort);
	}

	makePayment(credentials, amount, currency) {
		let wallet = new blockchain.MyWallet(credentials.username, credentials.password, credentials.password2);

		// Transform currency into satoshi

		return new Promise((resolve, reject) => {
			this.receiver.create(this.wallet.address, (error, addressData) => {
				if (error) {
					return reject(error);
				}

				wallet.send({
					to: addressData.input_address,
					amuont: amount
				}, (error, data) => {
					if (error) {
						return reject(error);
					}

					resolve(data);
				});
			});
		});
	}
};
