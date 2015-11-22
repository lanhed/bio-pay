'use strict';

const request = require('request');

let credentials = 'apgHNbIN4cms16MzV/BGE55rm0zcFs/Dqvddx+/ubc3lWOL0nat2D05u1ZGNQZ3fPIBn1LujlEnY8Ka01ue3lw6jL0WDNk2jE2qEhrXLZtr6N6SjFXV4sdBgKugWR1aqLAdMbIRDJ0KIf5hAld++7oWA2mWbz0xvAmRDSyrvWB9L7IBB91hsUD+4GtWJzkCMOp1rvwWkdtOziaqGbiqCor162OcuHStqAVWdNdt088jA3/TEIfYOxG5jqdF2VaPHDcGJiEWSEUMS7lNlfNwYsGsIWU/xXNmAqi9sXZ1Umq6X5BX3qNUUD8chQ+uqc4xKf4mVfR3Jl2QeIiMfHFgfUQ==';
let tagId = '04:54:47:59:E4:25:80';
let amount = 1000;
let receiveAddress = '14ZTswYdmX8BCPWdKnF3vh8a4P83rUfCKe';

let url = `http://localhost:3000/walletTsx?credentials=${encodeURIComponent(credentials)}&tagId=${tagId}&amount=${amount}&receiveAddress=${receiveAddress}`;

request(url, (error, response, body) => {
	if (error) {
		console.error(error);
	}

	console.log(body);
});
