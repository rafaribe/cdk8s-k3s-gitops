import { App, Chart } from 'cdk8s';
import { Construct } from 'constructs';
import { Unifi } from '../lib/unifi';

export class UnifiController extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new Unifi(this, {
      imageTag: '5.12.66-ls57',
      ipAddress: '192.168.1.250',
      name: 'unifi',
      namespace: 'unifi',
      timezone: 'Europe/Lisbon',
    });
  }
}

const app = new App();
new UnifiController(app, 'unifi');
app.synth();
