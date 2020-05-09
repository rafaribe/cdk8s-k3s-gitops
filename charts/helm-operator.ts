import { App, Chart } from 'cdk8s';
import { Construct } from 'constructs';
import { HelmRelease } from '../imports/helmrelease';

export class HelmOperator extends Chart {
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
        releaseName: 'helm-operator',
        chart: {
          repository: 'https://charts.fluxcd.io/',
          name: 'helm-operator',
          version: '1.0.2',
        },
        values: {
          createCRD: false,
          git: {
            ssh: {
              secretName: 'flux-git-deploy',
            },
          },
          helm: {
            versions: 'v3',
          },
          prometheus: {
            enabled: true,
            serviceMonitor: {
              create: true,
              namespace: 'flux',
              interval: '30s',
              scrapeTimeout: '10s',
            },
            resources: {
              requests: {
                cpu: '50m',
                memory: '64Mi',
              },
              limits: {
                memory: '512Mi',
              },
            },
          },
        },
      },
    });
  }
}

const app = new App();
new HelmOperator(app, 'helm-operator');
app.synth();
