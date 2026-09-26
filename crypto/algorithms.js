const CryptoJS = require("crypto-js");

// ============ 1. CAESAR CIPHER ============
function caesarEncrypt(text, shift) {
  shift = parseInt(shift) || 3;
  return text.replace(/[a-z]/gi, (char) => {
    const base = char === char.toUpperCase() ? 65 : 97;
    return String.fromCharCode(
      ((char.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base
    );
  });
}

function caesarDecrypt(text, shift) {
  shift = parseInt(shift) || 3;
  return caesarEncrypt(text, 26 - (shift % 26));
}

// ============ 2. AES ============
function aesEncrypt(text, key) {
  if (!key) throw new Error("AES requires a secret key.");
  return CryptoJS.AES.encrypt(text, key).toString();
}

function aesDecrypt(ciphertext, key) {
  if (!key) throw new Error("AES requires a secret key.");
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const result = bytes.toString(CryptoJS.enc.Utf8);
  if (!result) throw new Error("Decryption failed. Wrong key?");
  return result;
}

// ============ 3. DES ============
function desEncrypt(text, key) {
  if (!key) throw new Error("DES requires a secret key.");
  return CryptoJS.DES.encrypt(text, key).toString();
}

function desDecrypt(ciphertext, key) {
  if (!key) throw new Error("DES requires a secret key.");
  const bytes = CryptoJS.DES.decrypt(ciphertext, key);
  const result = bytes.toString(CryptoJS.enc.Utf8);
  if (!result) throw new Error("Decryption failed. Wrong key?");
  return result;
}

// ============ 4. BASE64 ============
function base64Encrypt(text) {
  return Buffer.from(text, "utf-8").toString("base64");
}

function base64Decrypt(ciphertext) {
  return Buffer.from(ciphertext, "base64").toString("utf-8");
}

// ============ 5. SHA-256 (One-way hash) ============
function sha256Hash(text) {
  return CryptoJS.SHA256(text).toString();
}

module.exports = {
  caesarEncrypt,
  caesarDecrypt,
  aesEncrypt,
  aesDecrypt,
  desEncrypt,
  desDecrypt,
  base64Encrypt,
  base64Decrypt,
  sha256Hash,
};