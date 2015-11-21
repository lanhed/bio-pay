'use strict';

const Crypt = require('./Crypt');

let crypt = new Crypt();

let salt = '04:54:47:59:E4:25:80';
let text = salt + '187d99c9-ed9a-4368-949b-3d948924bcd5,3g0n5t3N;:;:;';
console.log(text);

let e = crypt.encrypt(text);
console.log(e);

let d = crypt.decrypt(e);
console.log(d);
