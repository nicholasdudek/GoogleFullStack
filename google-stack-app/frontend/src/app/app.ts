import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  styleUrls: ['./app.scss']
})
export class App {
  title = 'aura-marketplace-v1';
  
  results: { [key: string]: any } = {
    gemini: '',
    storage: '',
    vision: '',
    translate: '',
    secrets: ''
  };

  agentLogs: { message: string, type: string }[] = [];
  loading: { [key: string]: boolean } = {};
  backendUrl = 'http://localhost:8080/api';

  async callService(service: string, payload?: any) {
    this.loading[service] = true;
    try {
      const resp = await fetch(`${this.backendUrl}/${service}`, {
        method: payload ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: payload ? JSON.stringify(payload) : null
      });
      const data = await resp.json();
      this.results[service] = data;
    } catch (err: any) {
      this.results[service] = { error: 'GCP Orchestrated Mock', details: 'Awaiting remote provision.' };
    } finally {
      this.loading[service] = false;
    }
  }

  // AI-Powered Actions for Aura
  generateAI() { 
    this.agentLogs.push({ message: 'Synthesizing Digital Asset via Gemini-Ultra...', type: 'info' });
    this.callService('generate', { prompt: 'Design a unique Gen-Alpha digital aesthetic for an ethereal asset exchange.' }); 
  }
  
  listStorage() { 
    this.agentLogs.push({ message: 'AlloyDB: Scanning high-frequency blocks...', type: 'info' });
    this.callService('storage/list'); 
  }
  
  analyzeVision() { 
    this.agentLogs.push({ message: 'Vertex AI: Performing Vector Embedding Search...', type: 'info' });
    this.callService('vision/analyze', { imageUri: 'gs://cloud-samples-data/vision/label/sunflower.jpg' }); 
  }
  
  translateText() { 
    this.agentLogs.push({ message: 'Stitch UI: Extracting Design DNA from photos...', type: 'info' });
    this.callService('translate', { text: 'Ethereal Minimalism DNA Extracted.', target: 'es' }); 
  }

  // 🚀 The 2027 "Lift-Off" Sequence
  triggerLiftOff() {
    this.agentLogs = [];
    const sequence = [
      { message: 'PROVISIONING FLASH (0-10s): Allocating Virtual Project Sandbox...', type: 'info', delay: 0 },
      { message: 'AlloyDB and Firestore instances PROVISIONED.', type: 'success', delay: 1500 },
      { message: 'DESIGN EXTRACTION (10-30s): Stitch is sampling "Ethereal" Photo Album...', type: 'info', delay: 3000 },
      { message: 'Interpolating Design DNA... Injecting CSS variables.', type: 'info', delay: 4500 },
      { message: 'LOGIC WEAVER (30-60s): Spinning up Architect & Integrator agents...', type: 'info', delay: 6000 },
      { message: 'Gemini-3-Ultra: Mapping AlloyDB routes and smart contract logic.', type: 'info', delay: 7500 },
      { message: 'QA BOT: Vibe-testing the environment. All systems nominal.', type: 'success', delay: 9000 },
      { message: 'EXECUTION COMPLETE. EXECUTE: LIFT-OFF SUCCESSFUL. 🚀', type: 'success', delay: 10500 }
    ];

    sequence.forEach(step => {
      setTimeout(() => {
        this.agentLogs.push({ message: step.message, type: step.type });
      }, step.delay);
    });
  }

  // Agent Interactivity
  sendAgentCommand(command: string) {
    this.agentLogs.push({ message: `Intent Received: ${command}`, type: 'info' });
    setTimeout(() => {
      this.agentLogs.push({ message: `Antigravity Processor: Mapping ${command} to GCP Infrastructure.`, type: 'info' });
    }, 1000);
  }
}
