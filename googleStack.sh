#!/bin/bash

# ==============================================================================
# Google Full-Stack + Antigravity IDE Initialization Script
# Stack: Angular (Frontend), Firebase (BaaS/Auth), Cloud Run (Backend API),
#        Firestore (DB), Gemini API (AI), Antigravity (Agent IDE Config)
# ==============================================================================

PROJECT_NAME="google-stack-app"

echo "🚀 Bootstrapping Google Full Stack + Antigravity Project: $PROJECT_NAME"
mkdir $PROJECT_NAME
cd $PROJECT_NAME

# ------------------------------------------------------------------------------
# 1. Antigravity Workspace Setup (The Agent Brain)
# ------------------------------------------------------------------------------
echo "🤖 Initializing Antigravity Agent Workspace..."

# Initialize the Antigravity local swarm environment
npx antigravity-ide@latest init

# Configure GEMINI.md (Global Context for Antigravity Agents)
cat << 'EOF' > GEMINI.md
# Project Architecture
- **Frontend:** Angular
- **Backend/Auth:** Firebase
- **Microservices:** Google Cloud Run (Node.js/Express)
- **Database:** Firestore (NoSQL)
- **AI Integration:** Gemini 3.1 Pro API

# Agent Directives
- Always run Angular tests (`ng test`) before marking a UI task as complete.
- Use the Firebase Admin SDK for backend database interactions.
- Prioritize verifiable Artifacts: capture screenshots of the UI using the internal browser before requesting human review.
EOF

# Set up Workspace Rules for Antigravity in .agent/rules
mkdir -p .agent/rules
cat << 'EOF' > .agent/rules/stack-rules.json
{
  "stack": ["angular", "firebase", "gcp-cloud-run", "gemini-api"],
  "allowedTerminalCommands": ["ng", "firebase", "gcloud", "npm", "docker"],
  "autoExecuteTerminal": "Auto"
}
EOF

# ------------------------------------------------------------------------------
# 2. Frontend: Angular Setup
# ------------------------------------------------------------------------------
echo "🌐 Scaffolding Angular Frontend..."
# Using npx to ensure the latest Angular CLI is used without global install
npx @angular/cli new frontend --routing --style=scss --skip-git
cd frontend
npm install firebase @angular/fire
cd ..

# ------------------------------------------------------------------------------
# 3. BaaS & Database: Firebase Setup
# ------------------------------------------------------------------------------
echo "🔥 Setting up Firebase..."
mkdir firebase-backend
cd firebase-backend

# Scaffold minimum required Firebase configuration
cat << 'EOF' > firebase.json
{
  "hosting": {
    "public": "../frontend/dist/frontend/browser",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [ { "source": "**", "destination": "/index.html" } ]
  },
  "firestore": {
    "rules": "firestore.rules"
  }
}
EOF

# Secure by default firestore rules
echo 'rules_version = "2"; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if false; } } }' > firestore.rules
cd ..

# ------------------------------------------------------------------------------
# 4. Backend Compute: Cloud Run Microservice Setup (with Gemini API)
# ------------------------------------------------------------------------------
echo "☁️ Setting up Cloud Run Backend (Node.js/Express)..."
mkdir cloud-run-backend
cd cloud-run-backend
npm init -y
npm install express @google/genai firebase-admin

# Create the Express server that interacts with the Gemini API
cat << 'EOF' > index.js
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
EOF

# Dockerfile for Cloud Run deployment
cat << 'EOF' > Dockerfile
FROM node:20-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
CMD [ "node", "index.js" ]
EOF
cd ..

echo "====================================================="
echo "✅ Google Full Stack Initialization Complete!"
echo "====================================================="