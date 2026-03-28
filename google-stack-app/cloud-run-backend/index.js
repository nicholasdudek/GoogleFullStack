const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const { Storage } = require('@google-cloud/storage');
const vision = require('@google-cloud/vision');
const { Translate } = require('@google-cloud/translate').v2;
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const app = express();
app.use(express.json());

// Initialize Google Cloud Clients
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const storage = new Storage();
const visionClient = new vision.ImageAnnotatorClient();
const translate = new Translate();
const secrets = new SecretManagerServiceClient();

// --- 🤖 GEMINI AI (Generative AI) ---
app.post('/api/generate', async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: req.body.prompt,
    });
    res.json({ result: response.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ☁️ CLOUD STORAGE ---
app.get('/api/storage/list', async (req, res) => {
  try {
    const [buckets] = await storage.getBuckets();
    res.json({ buckets: buckets.map(b => b.name) });
  } catch (err) {
    res.status(500).json({ error: err.message, mock: true, note: "Requires active GCP credentials" });
  }
});

// --- 👁️ CLOUD VISION (AI Image Analysis) ---
app.post('/api/vision/analyze', async (req, res) => {
  try {
    const { imageUri } = req.body;
    const [result] = await visionClient.labelDetection(imageUri);
    res.json({ labels: result.labelAnnotations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 🌏 CLOUD TRANSLATE ---
app.post('/api/translate', async (req, res) => {
  try {
    const { text, target } = req.body;
    const [translation] = await translate.translate(text, target);
    res.json({ translation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 🔐 SECRET MANAGER ---
app.get('/api/secret/:name', async (req, res) => {
  try {
    const [version] = await secrets.accessSecretVersion({
      name: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/secrets/${req.params.name}/versions/latest`,
    });
    const payload = version.payload.data.toString();
    res.json({ secret: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Unified Google Full Stack Engine listening on port ${port}`);
});
