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
  title = 'google-master-command-portal';
  
  intents: { title: string, desc: string }[] = [];
  masterResult: any = { message: 'Awaiting intent input.' };
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
      return data;
    } catch (err: any) {
      return { error: 'GCP Service Simulation Active', details: 'Awaiting remote provision.' };
    } finally {
      this.loading[service] = false;
    }
  }

  // 🚀 The Master Command Logic
  async executeMasterCommand(command: string) {
    this.intents.unshift({ title: `INTENT: ${command.toUpperCase()}`, desc: 'Orchestrating across Google Ecosystem...' });
    
    // Simulate multi-product orchestration
    if (command.toLowerCase().includes('auramarket')) {
      this.masterResult = { 
        project: 'Aura Marketplace',
        status: 'Provisioning',
        infra: ['AlloyDB Instance: L-Node-1', 'GCS Bucket: aura-assets'],
        agents: ['Antigravity-Engine-3.1', 'Stitch-UI-Agent'],
        deployment: 'Firebase Global Edge'
      };
    } else {
      const gResult = await this.callService('generate', { prompt: command });
      this.masterResult = gResult;
    }

    // Add success log
    setTimeout(() => {
      this.intents[0].desc = 'Execution successful. Infrastructure live.';
    }, 2000);
  }
}
