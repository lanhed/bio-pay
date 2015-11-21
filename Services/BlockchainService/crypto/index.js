'use strict';

const Crypt = require('./Crypt');

let crypt = new Crypt();

let salt = '';
let text = salt + '';
console.log(text);

let e = crypt.encrypt(text);
console.log(e);

let d = crypt.decrypt(e);
console.log(d);
