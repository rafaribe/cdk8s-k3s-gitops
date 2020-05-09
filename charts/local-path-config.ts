import { App, Chart } from 'cdk8s';
import { Construct } from 'constructs';
import { ConfigMap } from '../imports/k8s';
import * as fs from 'fs';

export class LocalPathConfig extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new ConfigMap(this, 'local-path-config', {
      metadata: {
        name: 'local-path-config',
        namespace: 'kube-system',
      },
      data: {
        'config.json': fs.readFileSync('./config/local-path-config.json').toString()
      }
    })
  }
}

  const app = new App();
  new LocalPathConfig(app, 'local-path-cfg');
  app.synth();