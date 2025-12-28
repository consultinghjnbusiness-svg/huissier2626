const fetch = require('node-fetch'); // Si Node <18, sinon fetch est natif

async function testOllama() {
  try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: "Explique brièvement ce qu’est un huissier de justice",
        stream: false
      })
    });

    const data = await response.json();
    console.log("Réponse Ollama :", data.response);
  } catch (err) {
    console.error("Erreur Ollama :", err);
  }
}

testOllama();
