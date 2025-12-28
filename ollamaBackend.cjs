// ollamaBackend.js
const express = require('express');
const fetch = require('node-fetch'); // si Node < 18, sinon fetch est natif
const app = express();
const PORT = 3000; // tu peux changer le port si nécessaire

app.use(express.json());

// Route pour générer du texte avec Ollama
app.post('/api/ollama', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt manquant" });

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();
    res.json({ response: data.response });

  } catch (err) {
    console.error("Erreur Ollama :", err);
    res.status(500).json({ error: "Erreur serveur Ollama" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Ollama actif sur http://localhost:${PORT}`);
});
