const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// Initialize Gemini 3.1 Pro (using the standard SDK)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/generate', async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro',
      contents: req.body.prompt,
    });
    res.json({ result: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Cloud Run service listening on port ${port}`);
});
