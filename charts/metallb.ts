import { App, Chart } from 'cdk8s';
import { Construct } from 'constructs';
import { HelmRelease } from '../imports/helmrelease';
import { ConfigMap } from '../imports/k8s';
import { readFileSync } from 'fs';

export class MetalLb extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const metallb = 'metallb';
    const metallbNamespace = 'metallb-system';

    const configMapName = 'metallb-config';
    new ConfigMap(this, configMapName, {
      metadata: {
        name: configMapName,
        namespace: metallbNamespace,
      },
      data: {
        config: readFileSync('./config/metallb-config.yaml').toString(),
      },
    });

    new HelmRelease(this, metallb, {
      metadata: {
        name: metallb,
        namespace: metallbNamespace,
        annotations: {
          ['fluxcd.io/automated']: 'false',
          ['fluxcd.io/ignore']: 'false',
        },
      },
      spec: {
        releaseName: metallb,
        chart: {
          repository: 'https://kubernetes-charts.storage.googleapis.com/',
          name: 'metallb',
          version: '0.12.0',
        },
        values: {
          controller: {},
          prometheus: {
            serviceMonitor: {
              enabled: true,
            },
            prometheusRule: {
              enabled: true,
            },
          },
          existingConfig: configMapName,
        },
      },
    });
  }
}

const app = new App();
new MetalLb(app, 'metal-lb');
app.synth();
