const fs = require('fs');
const path = require('path');
const jose = require('jose');
const crypto = require('crypto');

const keystore = new jose.JWKS.KeyStore();
if(!fs.existsSync('secret/'))
  fs.mkdirSync('secret')
Promise.all([
  keystore.generate('RSA', 2048, { use: 'sig' }),
  keystore.generate('RSA', 2048, { use: 'enc' }),
  keystore.generate('EC', 'P-256', { use: 'sig' }),
  keystore.generate('EC', 'P-256', { use: 'enc' }),
  keystore.generate('OKP', 'Ed25519', { use: 'sig' }),
]).then(() => {
  fs.writeFileSync(path.resolve('secret/jwks.json'), JSON.stringify(keystore.toJWKS(true)));
});

const generateSecret = () => {
  return crypto.randomBytes(16).toString('hex')
}

const cookiekeys = [
  generateSecret(),
  generateSecret()
]

fs.writeFileSync(path.resolve('secret/cookiekeys.json'), JSON.stringify(cookiekeys))