# node-aes256-encrypt

This library uses aes256 encryption algorithm and CBC (Cipher Block Chaining) or GCM (Galois/Counter Mode) modes of operation for encryption only for now.

## Installation

```sh
npm install node-aes256-encrypt
```

## Sample

```js
const { gcm } = require("node-aes256-encrypt");

cbc.setKey(process.env.ENCRYPTION_AES256_KEY);
const encryptedText = gcm.encrypt("Text to be encrypted");
const decryptedText = gcm.decrypt(encryptedText);
```

## Usage

### 1. Import Module:

import the module to your project.

```js
//for CBC method
const { cbc } = require("node-aes256-encrypt");
```

```js
//for GCM method
const { gcm } = require("node-aes256-encrypt");
```

### 2.Set Encryption Key:

Set the encryption key as it is required for encryption. The encryption key should be 256 bits long, or 32 bytes. It is important to generate a key with sufficient entropy and randomness to ensure its strength.

```js
//for CBC method
cbc.setKey("enter your key here...");
```

```js
//for GCM method
gcm.setKey("enter your key here...");
```

If you don't have a key yet, you can generate using the keyGen function of this library.

include keyGen to your file.

```js
const { keyGen } = require("node-aes256-encrypt");
```

Generate a key and save it as the encryption key. This key should be kept intensively as it can be used to decrypt all encrypted data.

NOTE: You can create a key for production only, and a separate key for development that you can share with other developers.

```js
const encryptionKey = keyGen();
```

Create a `.env` file to the root directory of your project, or save it as an environment variable on your server.

```env
ENCRYPTION_AES256_KEY="place your key here..."
```

install dotenv dependency to your project

```sh
## npm
npm install dotenv
```

then include it to your main js file.

```js
require("dotenv").config();
```

Use the environment variable instead in the setKey parameter.

```js
//for CBC method
cbc.setKey(process.env.ENCRYPTION_AES256_KEY);
```

```js
//for GCM method
gcm.setKey(process.env.ENCRYPTION_AES256_KEY);
```

### 3. Encrypt:

```js
//for CBC method
const { iv: cbcIv, text: cbcText } = cbc.encryptLong("Text to be encrypted");
```

```js
//or for Long CBC method
const encryptedCbc = cbc.encrypt("Text to be encrypted");
```

you can not store the iv using cbcIv variable, and the encrypted text using cbcText variable

IV (Initialization Vector): It is a random or unique value that is used as the initial input for the encryption algorithm. The IV ensures that even if the same plaintext is encrypted multiple times, the resulting ciphertext will be different. It adds randomness and prevents patterns from emerging in the encrypted data. The IV is typically required for symmetric encryption algorithms like AES in modes such as CBC or GCM.

```js
//for GCM method

const {
  iv: gcmIv,
  text: gcmText,
  tag: gcmTag,
} = gcm.encrypt("Text to be encrypted");
```

```js
//or for Quick GCM method
const encryptedGcm = gcm.encrypt("Text to be encrypted");
```

you can now store the iv using gcmIv variable, the encrypted text using gcmText variable, and the tag using gcmTag variable.

Tag: In the context of authenticated encryption modes like GCM (Galois/Counter Mode), a tag is a piece of data generated during the encryption process. The tag provides integrity and authenticity checks for the ciphertext. It is used to verify that the ciphertext has not been tampered with or modified during transmission or storage. The tag is generated using the encryption key, IV, and additional authentication data, if provided.

### 4. Decrypt:

To decrypt the encrypted text, you will need to set the same encryption key that you set before encrypting it, as well as the iv if you use the cbc method,

```js
//for CBC method
const cbcDecrypted = cbc.decrypt(cbcIv, cbcText);
```

```js
//or for Quick CBC method
const decryptedCbc = cbc.decrypt(encryptedCbc);
```

And iv plus tag if you used the gcm method.

```js
//for GCM method
const gcmDecrypted = gcm.decryptLong(gcmIv, gcmText, gcmTag);
```

```js
//or for Quick GCM method
const decryptedGcm = gcm.decrypt(encryptedGcm);
```

## Tips:

It is recommended to follow established practices for storing IV and tag securely. Here are some common approaches:

- Prepend or append the IV and tag: Instead of concatenating them directly with the encrypted text, you can prepend or append the IV and tag as separate values. For example, you can store them as separate fields or use a delimiter to distinguish them from the encrypted text.

- Store IV and tag separately: You can store the IV and tag in a separate storage or metadata associated with the encrypted data. This keeps them distinct and allows for proper retrieval and usage during decryption.

- Encrypt the IV and tag: To enhance security, you can encrypt the IV and tag themselves before storing them. This can provide an additional layer of protection against potential attacks targeting the stored IV and tag values.

By following these practices, you can maintain the integrity and security of the IV and tag, ensuring the proper decryption of encrypted data while reducing the risk of exposing sensitive information.
