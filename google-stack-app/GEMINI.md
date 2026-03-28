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
