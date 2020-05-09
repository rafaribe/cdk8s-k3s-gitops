import { App, Chart } from 'cdk8s';
import { Construct } from 'constructs';
import { HelmRelease } from '../imports/helmrelease';

export class FluxHr extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new HelmRelease(this, 'fluxhr', {
      metadata: {
        name: 'flux',
        namespace: 'flux',
        annotations: {
          ['fluxcd.io/automated']: 'false',
          ['fluxcd.io/ignore']: 'false',
        },
      },
      spec: {
        releaseName: 'flux',
        chart: {
          repository: 'https://charts.fluxcd.io/',
          name: 'flux',
          version: '1.3.0',
        },
        values: {
          helmOperator: {
            create: 'false',
          },
        },
      },
    });
  }
}

const app = new App();
new FluxHr(app, 'helmflux');
app.synth();
