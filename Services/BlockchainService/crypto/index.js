'use strict';

const Crypt = require('./Crypt');
const NodeRsa = require('node-rsa');

let key = new NodeRsa({ b: 512 });

let crypt = new Crypt(/*{
	publicKey: key.exportKey('public'),
	privateKey: key.exportKey('private')
}*/);

// let text = salt + 'A,a';
console.log(text);

let e = crypt.encrypt(text);
console.log(e);

let d = crypt.decrypt(e);
console.log(d);





// console.log(key.exportKey('private'));
// console.log(key.exportKey('public'));
