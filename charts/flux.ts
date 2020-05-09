import { App, Chart } from 'cdk8s';
import { Construct } from 'constructs';
import { Flux } from '../lib/flux';

export class FluxDaemon extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new Flux(this, 'flux', {
      arguments: [],
      namespace: 'flux',
      prometheusOperator: true,
      replicas: 1,
      tag: '1.19.0',
      name: 'flux',
    });
  }
}

const app = new App();
new FluxDaemon(app, 'flux');
app.synth();
