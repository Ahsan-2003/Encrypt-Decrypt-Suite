const API_URL = "/api";

const $ = (id) => document.getElementById(id);
const plaintextEl = $("plaintext");
const algorithmEl = $("algorithm");
const keyEl = $("key");
const outputEl = $("output");
const messageEl = $("message");

function showMessage(text, type = "error") {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}
function clearMessage() {
  messageEl.textContent = "";
  messageEl.className = "message";
}

// ---------- Generic request ----------
async function sendRequest(endpoint) {
  clearMessage();
  const text = plaintextEl.value.trim();
  const algorithm = algorithmEl.value;
  const key = keyEl.value.trim();

  // Client-side validation
  if (!text) return showMessage("⚠️ Please enter some text.");
  if (!algorithm) return showMessage("⚠️ Please select an algorithm.");
  if (["aes", "des"].includes(algorithm) && !key) {
    return showMessage(`⚠️ ${algorithm.toUpperCase()} requires a key.`);
  }

  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, algorithm, key }),
    });
    const data = await res.json();

    if (!res.ok) {
      return showMessage(`❌ ${data.error}`);
    }

    outputEl.value = data.result;
    showMessage(`✅ ${endpoint === "encrypt" ? "Encrypted" : "Decrypted"} successfully!`, "success");
  } catch (err) {
    showMessage("❌ Network error. Is the server running?");
  }
}

// ---------- Button handlers ----------
$("encryptBtn").addEventListener("click", () => sendRequest("encrypt"));
$("decryptBtn").addEventListener("click", () => sendRequest("decrypt"));

$("copyBtn").addEventListener("click", async () => {
  if (!outputEl.value) return showMessage("⚠️ Nothing to copy.");
  try {
    await navigator.clipboard.writeText(outputEl.value);
    showMessage("✅ Copied to clipboard!", "success");
  } catch {
    showMessage("❌ Copy failed.");
  }
});

$("clearBtn").addEventListener("click", () => {
  plaintextEl.value = "";
  keyEl.value = "";
  outputEl.value = "";
  algorithmEl.value = "";
  clearMessage();
});