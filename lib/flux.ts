import { Construct } from 'constructs';
import {
  ClusterRole,
  ClusterRoleBinding,
  Deployment,
  Namespace,
  Probe,
  Quantity,
  Secret,
  Service,
  ServiceAccount,
  Volume,
} from '../imports/k8s';
import { ServiceMonitor } from '../imports/servicemonitor';

export interface FluxOptions {
  /**
   * The image for flux (docker hub only)
   */
  readonly image: string;
  /**
   * The tag for the flux image
   */
  readonly tag: string;

  /**
   * The name for the flux container
   */
  readonly name: string;

  /**
   * The Namespace that should be used for the resources
   */
  readonly namespace: string;

  /**
   * Number of replicas.
   *
   * @default 1
   */
  readonly replicas?: number;

  /**
   * Flux Arguments
   *
   */
  readonly arguments: string[];

  /**
   * Deploy prometheus operator?
   *
   * @default false
   */
  readonly prometheusOperator: boolean;
}

export class Flux extends Construct {
  constructor(scope: Construct, constructId: string, options: FluxOptions) {
    super(scope, constructId);
    const label = { name: options.name };

    const limits = {
      memory: Quantity.fromString('64Mi'),
      cpu: Quantity.fromString('50m'),
    };

    const fluxPort = 3030;
    const fluxPortName = 'http';

    new Namespace(this, options.namespace, {
      metadata: {
        name: options.namespace,
        labels: label,
      },
    });

    const serviceAccount = new ServiceAccount(this, options.name + 'sa', {
      metadata: {
        labels: label,
        name: options.name,
        namespace: options.namespace,
      },
    });

    const clusterRole = new ClusterRole(this, options.name + '-cr', {
      metadata: {
        labels: label,
        name: options.name,
      },
      rules: [
        {
          apiGroups: ['*'],
          resources: ['*'],
          verbs: ['*'],
        },
        {
          nonResourceURLs: ['*'],
          verbs: ['*'],
        },
      ],
    });

    new ClusterRoleBinding(this, options.name + '-crb', {
      metadata: {
        labels: label,
        name: options.name,
      },
      roleRef: {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: clusterRole.kind,
        name: clusterRole.name,
      },
      subjects: [
        {
          kind: serviceAccount.kind,
          name: serviceAccount.name,
          namespace: options.namespace,
        },
      ],
    });

    const probe: Probe = {
      httpGet: {
        port: fluxPort,
        path: 'api/flux/v6/identity.pub',
      },
      initialDelaySeconds: 5,
      timeoutSeconds: 5,
    };
    const fluxGitDeploy = options.name + '-git-deploy';

    const volumes: Volume[] = [
      {
        name: 'git-key',
        secret: {
          secretName: fluxGitDeploy,
          defaultMode: 0o400,
        },
      },
      {
        name: 'git-keygen',
        emptyDir: { medium: 'Memory' },
      },
    ];

    new Secret(this, options.name + '-secret', {
      metadata: {
        name: fluxGitDeploy,
        namespace: options.namespace,
      },
      type: 'Opaque',
    });

    new Deployment(this, options.name + '-dp', {
      metadata: {
        namespace: options.namespace,
        name: options.name,
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label,
        },
        strategy: {
          type: 'Recreate',
        },
        template: {
          metadata: {
            labels: label,
          },
          spec: {
            serviceAccountName: serviceAccount.name,
            volumes: volumes,
            containers: [
              {
                name: options.name,
                image: options.image + ':' + options.tag,
                imagePullPolicy: 'IfNotPresent',
                ports: [{ containerPort: fluxPort }],
                resources: {
                  limits: limits,
                },
                livenessProbe: probe,
                readinessProbe: probe,
                volumeMounts: [
                  {
                    name: volumes[0].name,
                    mountPath: '/etc/fluxd/ssh',
                    readOnly: true,
                  },
                  {
                    name: volumes[1].name,
                    mountPath: '/etc/fluxd/keygen',
                  },
                ],
                args: options.arguments,
              },
            ],
          },
        },
      },
    });

    const memcachedName = 'memcached';
    const memcachedLabels = {
      name: memcachedName,
    };
    const memcachedPort: number = 11211;
    new Deployment(this, options.name + '-memcached', {
      metadata: {
        name: memcachedName,
        namespace: options.namespace,
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: memcachedLabels,
        },
        template: {
          metadata: {
            labels: memcachedLabels,
          },
          spec: {
            containers: [
              {
                name: memcachedName,
                image: 'memcached:1.5.20',
                args: ['-m 512', '-I 5m', '-p ' + memcachedPort],
                ports: [
                  {
                    name: 'clients',
                    containerPort: memcachedPort,
                  },
                ],
                securityContext: {
                  runAsGroup: memcachedPort,
                  runAsUser: memcachedPort,
                  allowPrivilegeEscalation: false,
                },
              },
            ],
          },
        },
      },
    });
    new Service(this, memcachedName + '-svc', {
      metadata: {
        name: memcachedName,
        namespace: options.name,
      },
      spec: {
        ports: [
          {
            port: memcachedPort,
            name: memcachedName,
          },
        ],
        selector: {
          ['name']: memcachedName,
        },
      },
    });

    if (options.prometheusOperator) {
      new Service(this, options.name + '-svc', {
        metadata: {
          name: options.name,
          namespace: options.namespace,
          labels: label,
        },
        spec: {
          type: 'ClusterIP',
          ports: [
            {
              port: fluxPort,
              targetPort: fluxPortName,
              protocol: 'TCP',
              name: fluxPortName,
            },
          ],
        },
      });

      new ServiceMonitor(this, options.name + '-sm', {
        metadata: {
          namespace: options.namespace,
          name: options.name,
          labels: {
            ['prometheus']: 'monitoring',
          },
        },
        spec: {
          selector: {
            matchLabels: label,
          },
          endpoints: [
            {
              honorLabels: true,
              port: fluxPortName,
              path: '/metrics',
              interval: '30s',
            },
          ],
          namespaceSelector: {
            matchNames: [options.namespace],
          },
        },
      });
    }
  }
}
