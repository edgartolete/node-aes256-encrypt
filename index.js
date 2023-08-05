
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const util = require('util');

//returns only a hash: string;
 const hash = (text) => {
    const saltRounds = 10;
    bcrypt.hash(text, saltRounds, (err, hash) =>{
        if(err){
            console.error('Error hashing password: ', err);
        }else{
            console.log('Hashed Password: ', hash);
            return hash;
        }
        return "";
    });
    return "";
}


//returns only boolean
 const compare = (text, hash) => {
    bcrypt.compare(text, hash, (err, result) =>{
        if(err){
            console.error('Error comparing password', err);
        }else{
            if(result === true){
                console.log('Password is correct');
                return true;
            }else{
                console.log('Password is incorrect')

            }
        }
        return false;
    })
    return false;
}

const generatePBKDF2Key = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 10000;
  const keyLength = 32;

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keyLength, 'sha256', (err, derivedKey) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve({ key: derivedKey.toString('hex'), salt: salt });
      }
    });
  });
};
/**
## Example usage:
const password = 'mysecretpassword';
generatePBKDF2Key(password)
    .then((derivedKey) => {
        console.log('PBKDF2 Key:', derivedKey);
        return derivedKey;
    })
    .catch((err) => {
        console.error('Error generating PBKDF2 key:', err);
    });
 */


const encrypt = (text, key) => {
    const iv = crypto.randomBytes(12); 
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    const result = iv.toString('hex') + encrypted.toString('hex') +tag.toString('hex');
    return result;
}

const decrypt = (text, key) => {
    const ivHex = text.slice(0, 24); 
    const encryptedText = text.slice(24, -32);
    const tagHex = text.slice(-32); 

    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedText, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


module.exports = {hash, compare, generatePBKDF2Key, encrypt, decrypt}
