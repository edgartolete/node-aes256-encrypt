
const crypto = require('crypto');

let cbcKey = null;
let gcmKey = null;

module.exports = {
    cbc: {
        setKey: (textKey) => cbcKey = Buffer.from(textKey, 'base64'),
        encrypt: (text) => cbcEncrypt(text),
        decrypt: (ivHex, encryptedText) => cbcDecrypt(ivHex, encryptedText),
        encryptQuick: (data) => {
            const {iv, text} = cbcEncrypt(data);
            return iv + text;
        },
        decryptQuick: (data) => {
            ivHex = data.slice(0,32);
            encryptedText = data.slice(32)
            return cbcDecrypt(ivHex, encryptedText)
        }
    },
    gcm: {
        setKey: (textKey) => gcmKey = Buffer.from(textKey, 'base64'),
        encrypt: (text) => gcmEncrypt(text),
        decrypt: (ivHex, encryptedText, tagHex) => gcmDecrypt(ivHex, encryptedText, tagHex),
        encryptQuick: (data) =>{
            const {iv, text, tag } = gcmEncrypt(data);
            return iv + text + tag;
        },
        decryptQuick: (data) => {
            const ivHex = data.slice(0, 24); 
            const encryptedText = data.slice(24, -32); 
            const tagHex = data.slice(-32); 
            return gcmDecrypt(ivHex, encryptedText, tagHex);
        },
    },
    keyGen: () => crypto.randomBytes(32).toString('base64')
}


const cbcEncrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", cbcKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        text: encrypted
    };
}


const cbcDecrypt = (ivHex, encryptedText) =>{
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv("aes-256-cbc", cbcKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


const gcmEncrypt = (text) => {
    const iv = crypto.randomBytes(12); 
    const cipher = crypto.createCipheriv("aes-256-gcm", gcmKey, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
        iv: iv.toString('hex'),
        text: encrypted.toString('hex'),
        tag: tag.toString('hex')
    };  
}

const gcmDecrypt = (ivHex, encryptedText, tagHex) => {
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedText, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv("aes-256-gcm", gcmKey, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}