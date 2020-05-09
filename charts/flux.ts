import { App, Chart } from 'cdk8s';
import { Construct } from 'constructs';
import { Flux } from '../lib/flux';

export class FluxDaemon extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);


    new Flux(this, 'flux', {
      namespace: 'flux',
      name: 'flux',
      tag: '1.19.0',
      prometheusOperator: true,
      replicas: 1,
      arguments: [
        '--memcached-service=',
        '--ssh-keygen-dir=/var/fluxd/keygen',
        '--git-url=git@github.com:rafaribe/cdk8s-k3s-gitops.git',
        '--git-branch=master',
        '--git-label=flux',
        '--git-user=flux',
        '--git-email=flux@rafaribe.com',
        '--git-poll-interval=5m',
        '--sync-garbage-collection'
      ],
    });
  }
}

const app = new App();
new FluxDaemon(app, 'flux');
app.synth();
