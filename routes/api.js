const express = require("express");
const router = express.Router();
const algo = require("../crypto/algorithms");

// ---------- VALIDATION HELPER ----------
function validate(body, requireKey = false) {
  const { text, algorithm, key } = body;

  if (!text || !text.trim()) {
    return "⚠️ Text cannot be empty.";
  }
  if (!algorithm) {
    return "⚠️ Please select an algorithm.";
  }
  if (requireKey && (!key || !key.trim())) {
    return `⚠️ ${algorithm.toUpperCase()} requires a key.`;
  }
  return null;
}

// ---------- ENCRYPT ROUTE ----------
router.post("/encrypt", (req, res) => {
  const { text, algorithm, key } = req.body;

  const needsKey = ["aes", "des"].includes(algorithm);
  const error = validate(req.body, needsKey);
  if (error) return res.status(400).json({ error });

  try {
    let result = "";
    switch (algorithm) {
      case "caesar": result = algo.caesarEncrypt(text, key); break;
      case "aes":    result = algo.aesEncrypt(text, key); break;
      case "des":    result = algo.desEncrypt(text, key); break;
      case "base64": result = algo.base64Encrypt(text); break;
      case "sha256": result = algo.sha256Hash(text); break;
      default: return res.status(400).json({ error: "Unknown algorithm." });
    }
    res.json({ result, algorithm, mode: "encrypt" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- DECRYPT ROUTE ----------
router.post("/decrypt", (req, res) => {
  const { text, algorithm, key } = req.body;

  if (algorithm === "sha256") {
    return res.status(400).json({ error: "SHA-256 is a hash and cannot be decrypted." });
  }

  const needsKey = ["aes", "des"].includes(algorithm);
  const error = validate(req.body, needsKey);
  if (error) return res.status(400).json({ error });

  try {
    let result = "";
    switch (algorithm) {
      case "caesar": result = algo.caesarDecrypt(text, key); break;
      case "aes":    result = algo.aesDecrypt(text, key); break;
      case "des":    result = algo.desDecrypt(text, key); break;
      case "base64": result = algo.base64Decrypt(text); break;
      default: return res.status(400).json({ error: "Unknown algorithm." });
    }
    res.json({ result, algorithm, mode: "decrypt" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;