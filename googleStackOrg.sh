#!/bin/bash

# ==============================================================================
# 🚀 THE GOOGLE "ULTRA" FULL-STACK INITIALIZER (2026 Edition)
# Stack: Angular + Firebase + Cloud Run + Gemini 3.1 (Auto-Detect)
# ==============================================================================

PROJECT_NAME="google-ultra-app"

echo "💎 Initializing Official Google Stack: $PROJECT_NAME"
mkdir $PROJECT_NAME && cd $PROJECT_NAME

# ------------------------------------------------------------------------------
# 1. FRONTEND: Angular Workspace
# ------------------------------------------------------------------------------
echo "📦 Scaffolding Angular Frontend..."
npx @angular/cli new frontend --routing --style=scss --skip-install --skip-git
cd frontend && npm install firebase @angular/fire && cd ..

# ------------------------------------------------------------------------------
# 2. BACKEND: Cloud Run + Gemini Auto-Detect API
# ------------------------------------------------------------------------------
echo "☁️ Creating Cloud Run Service..."
mkdir server && cd server
npm init -y
npm install express @google/genai firebase-admin cors

cat << 'EOF' > index.js
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const admin = require('firebase-admin');

admin.initializeApp();
const app = express();
app.use(cors(), express.json());

// AUTO-DETECTION: Using the 'gemini-pro' alias ensures Google routes 
// your request to the latest stable Pro model (Gemini 3.1 Pro as of 2026).
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.post('/api/generate', async (req, res) => {
  try {
    const result = await model.generateContent(req.body.prompt);
    res.json({ response: result.response.text() });
  } catch (e) {
    res.status(500).json({ error: "Model routing failed. Check GCP Quotas." });
  }
});

app.listen(8080, () => console.log('Server running on 8080'));
EOF

cat << 'EOF' > Dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
CMD ["node", "index.js"]
EOF
cd ..

# ------------------------------------------------------------------------------
# 3. INFRASTRUCTURE: Firebase & Firestore Config
# ------------------------------------------------------------------------------
echo "🔥 Configuring Firebase Infrastructure..."
mkdir firebase && cd firebase
cat << 'EOF' > firebase.json
{
  "hosting": {
    "public": "../frontend/dist/frontend/browser",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [ { "source": "**", "destination": "/index.html" } ]
  },
  "firestore": { "rules": "firestore.rules" }
}
EOF
echo 'rules_version = "2"; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if request.auth != null; } } }' > firestore.rules
cd ..

# ------------------------------------------------------------------------------
# 4. ORCHESTRATION: The Deployment Script
# ------------------------------------------------------------------------------
cat << 'EOF' > deploy.sh
#!/bin/bash
PROJECT_ID=$(gcloud config get-value project)
echo "🚀 Deploying $PROJECT_ID..."

# Build & Deploy Backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/api-service ./server
gcloud run deploy api-service --image gcr.io/$PROJECT_ID/api-service --platform managed --region us-central1 --allow-unauthenticated

# Build & Deploy Frontend
cd frontend && npm run build --prod && cd ..
cd firebase && firebase deploy --only hosting
EOF
chmod +x deploy.sh

echo "-----------------------------------------------------"
echo "✅ Done! Your official Google Stack is ready."
echo "👉 Run './deploy.sh' to push everything to the cloud."
echo "-----------------------------------------------------"