'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true,
});
const constructs_1 = require('constructs');
const k8s_1 = require('../imports/k8s');
const servicemonitor_1 = require('../imports/servicemonitor');
class Flux extends constructs_1.Construct {
  constructor(scope, constructId, options) {
    super(scope, constructId);
    const label = { name: options.name };
    const limits = {
      memory: k8s_1.Quantity.fromString('64Mi'),
      cpu: k8s_1.Quantity.fromString('50m'),
    };
    const fluxPort = 3030;
    const fluxPortName = 'http';
    new k8s_1.Namespace(this, options.namespace, {
      metadata: {
        name: options.namespace,
        labels: label,
      },
    });
    const serviceAccount = new k8s_1.ServiceAccount(
      this,
      options.name + 'sa',
      {
        metadata: {
          labels: label,
          name: options.name,
          namespace: options.namespace,
        },
      },
    );
    const clusterRole = new k8s_1.ClusterRole(
      this,
      options.name + '-cr',
      {
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
      },
    );
    new k8s_1.ClusterRoleBinding(
      this,
      options.name + '-crb',
      {
        metadata: {
          labels: label,
          name: options.name,
        },
        roleRef: {
          apiGroup: clusterRole.apiVersion,
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
      },
    );
    const probe = {
      httpGet: {
        port: fluxPort,
        path: 'api/flux/v6/identity.pub',
      },
      initialDelaySeconds: 5,
      timeoutSeconds: 5,
    };
    const volumes = [
      {
        name: 'git-key',
        secret: {
          secretName:
            options.name + '-git-deploy',
          defaultMode: 400,
        },
      },
      {
        name: 'git-keygen',
        emptyDir: { medium: 'Memory' },
      },
    ];
    new k8s_1.Deployment(
      this,
      options.name + '-dp',
      {
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
              serviceAccountName:
                serviceAccount.name,
              volumes: volumes,
              containers: [
                {
                  name: options.name,
                  image:
                    'docker.io/fluxcd/flux:' +
                    options.tag,
                  imagePullPolicy: 'IfNotPresent',
                  ports: [
                    { containerPort: fluxPort },
                  ],
                  resources: {
                    limits: limits,
                  },
                  livenessProbe: probe,
                  readinessProbe: probe,
                  volumeMounts: [
                    {
                      name: volumes[0].name,
                      mountPath: '/etc/fluxd/ssh',
                    },
                    {
                      name: volumes[1].name,
                      mountPath:
                        '/etc/fluxd/keygen',
                    },
                  ],
                  args: options.arguments,
                },
              ],
            },
          },
        },
      },
    );
    const memcachedName = 'memcached';
    const memcachedLabels = {
      name: memcachedName,
    };
    const memcachedPort = 11211;
    new k8s_1.Deployment(
      this,
      options.name + '-memcached',
      {
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
                  image: 'memcached:1.6.5',
                  args: [
                    '-m 512',
                    '-I 5m',
                    '-p ' + memcachedPort,
                  ],
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
      },
    );
    new k8s_1.Service(
      this,
      memcachedName + '-svc',
      {
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
        },
      },
    );
    if (options.prometheusOperator) {
      new k8s_1.Service(
        this,
        options.name + '-svc',
        {
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
        },
      );
      new servicemonitor_1.ServiceMonitor(
        this,
        options.name + '-sm',
        {
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
        },
      );
    }
  }
}
exports.Flux = Flux;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx1eC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZsdXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBdUM7QUFDdkMsd0NBUXdCO0FBQ3hCLDhEQUEyRDtBQXdDM0QsTUFBYSxJQUFLLFNBQVEsc0JBQVM7SUFDakMsWUFDRSxLQUFnQixFQUNoQixXQUFtQixFQUNuQixPQUFvQjtRQUVwQixLQUFLLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVyQyxNQUFNLE1BQU0sR0FBRztZQUNiLE1BQU0sRUFBRSxjQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztZQUNuQyxHQUFHLEVBQUUsY0FBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7U0FDaEMsQ0FBQztRQUVGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQztRQUN0QixNQUFNLFlBQVksR0FBRyxNQUFNLENBQUM7UUFFNUIsSUFBSSxlQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDckMsUUFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxTQUFTO2dCQUNsQyxNQUFNLEVBQUUsS0FBSyxFQUFDO1NBRWYsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsSUFBSSxvQkFBYyxDQUN2QyxJQUFJLEVBQ0osT0FBTyxDQUFDLElBQUksR0FBRSxJQUFJLEVBQ2xCO1lBQ0UsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtnQkFDbEIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO2FBQzdCO1NBQ0YsQ0FDRixDQUFDO1FBRUYsTUFBTSxXQUFXLEdBQUcsSUFBSSxpQkFBVyxDQUNqQyxJQUFJLEVBQ0osT0FBTyxDQUFDLElBQUksR0FBRyxLQUFLLEVBQ3BC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QUFFO3dCQUNUOzRCQUNFLFdBQVcsRUFBRSxJQUFJOzRCQUNqQixJQUFJLEVBQUUsWUFBWTs0QkFDbEIsSUFBSSxFQUFFLFVBQVU7NEJBQ2hCLFFBQVEsRUFBRSxLQUFLO3lCQUNoQjtxQkFDRjtvQkFDRCxpQkFBaUIsRUFBRTt3QkFDakIsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztxQkFDaEM7aUJBQ0Y7YUFDRixDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Q0FDRjtBQWpQRCxvQkFpUEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7XG4gIENsdXN0ZXJSb2xlLFxuICBDbHVzdGVyUm9sZUJpbmRpbmcsXG4gIERlcGxveW1lbnQsXG4gIE5hbWVzcGFjZSwgUHJvYmUsXG4gIFF1YW50aXR5LFxuICBTZXJ2aWNlLFxuICBTZXJ2aWNlQWNjb3VudCwgVm9sdW1lLFxufSBmcm9tICcuLi9pbXBvcnRzL2s4cyc7XG5pbXBvcnQgeyBTZXJ2aWNlTW9uaXRvciB9IGZyb20gJy4uL2ltcG9ydHMvc2VydmljZW1vbml0b3InO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZsdXhPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSB0YWcgZm9yIHRoZSBmbHV4IGltYWdlXG4gICAqL1xuICByZWFkb25seSB0YWc6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgZm9yIHRoZSBmbHV4IGNvbnRhaW5lclxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgTmFtZXNwYWNlIHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIHRoZSByZXNvdXJjZXNcbiAgICovXG4gIHJlYWRvbmx5IG5hbWVzcGFjZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgcmVwbGljYXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IDFcbiAgICovXG4gIHJlYWRvbmx5IHJlcGxpY2FzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBGbHV4IEFyZ3VtZW50c1xuICAgKlxuICAgKiBAZGVmYXVsXG4gICAqL1xuICByZWFkb25seSBhcmd1bWVudHM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBEZXBsb3kgcHJvbWV0aGV1cyBvcGVyYXRvcj9cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHByb21ldGhldXNPcGVyYXRvcjogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEZsdXggZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihcbiAgICBzY29wZTogQ29uc3RydWN0LFxuICAgIGNvbnN0cnVjdElkOiBzdHJpbmcsXG4gICAgb3B0aW9uczogRmx1eE9wdGlvbnMsXG4gICkge1xuICAgIHN1cGVyKHNjb3BlLCBjb25zdHJ1Y3RJZCk7XG4gICAgY29uc3QgbGFiZWwgPSB7IG5hbWU6IG9wdGlvbnMubmFtZSB9O1xuXG4gICAgY29uc3QgbGltaXRzID0ge1xuICAgICAgbWVtb3J5OiBRdWFudGl0eS5mcm9tU3RyaW5nKCc2NE1pJyksXG4gICAgICBjcHU6IFF1YW50aXR5LmZyb21TdHJpbmcoJzUwbScpLFxuICAgIH07XG5cbiAgICBjb25zdCBmbHV4UG9ydCA9IDMwMzA7XG4gICAgY29uc3QgZmx1eFBvcnROYW1lID0gJ2h0dHAnO1xuXG4gICAgbmV3IE5hbWVzcGFjZSh0aGlzLCBvcHRpb25zLm5hbWVzcGFjZSwge1xuICAgICAgbWV0YWRhdGE6eyBuYW1lOiBvcHRpb25zLm5hbWVzcGFjZSxcbiAgICAgIGxhYmVsczogbGFiZWx9XG5cbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2VBY2NvdW50ID0gbmV3IFNlcnZpY2VBY2NvdW50KFxuICAgICAgdGhpcyxcbiAgICAgIG9wdGlvbnMubmFtZSArJ3NhJyxcbiAgICAgIHtcbiAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICBsYWJlbHM6IGxhYmVsLFxuICAgICAgICAgIG5hbWU6IG9wdGlvbnMubmFtZSxcbiAgICAgICAgICBuYW1lc3BhY2U6IG9wdGlvbnMubmFtZXNwYWNlXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBjb25zdCBjbHVzdGVyUm9sZSA9IG5ldyBDbHVzdGVyUm9sZShcbiAgICAgIHRoaXMsXG4gICAgICBvcHRpb25zLm5hbWUgKyAnLWNyJyxcbiAgICAgIHtcbiAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICBsYWJlbHM6IGxhYmVsLFxuICAgICAgICAgIG5hbWU6IG9wdGlvbnMubmFtZSxcbiAgICAgICAgfSxcbiAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBhcGlHcm91cHM6IFsnKiddLFxuICAgICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgICAgIHZlcmJzOiBbJyonXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5vblJlc291cmNlVVJMczogWycqJ10sXG4gICAgICAgICAgICB2ZXJiczogWycqJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIG5ldyBDbHVzdGVyUm9sZUJpbmRpbmcodGhpcywgb3B0aW9ucy5uYW1lICsgJy1jcmInLCB7XG4gICAgICBtZXRhZGF0YTogeyBsYWJlbHM6IGxhYmVsLCBuYW1lOiBvcHRpb25zLm5hbWV9LFxuICAgICAgcm9sZVJlZjoge1xuICAgICAgICBhcGlHcm91cDogY2x1c3RlclJvbGUuYXBpVmVyc2lvbixcbiAgICAgICAga2luZDogY2x1c3RlclJvbGUua2luZCxcbiAgICAgICAgbmFtZTogY2x1c3RlclJvbGUubmFtZSxcbiAgICAgIH0sXG4gICAgICBzdWJqZWN0czogW1xuICAgICAgICB7XG4gICAgICAgICAga2luZDogc2VydmljZUFjY291bnQua2luZCxcbiAgICAgICAgICBuYW1lOiBzZXJ2aWNlQWNjb3VudC5uYW1lLFxuICAgICAgICAgIG5hbWVzcGFjZTogb3B0aW9ucy5uYW1lc3BhY2UsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvYmU6IFByb2JlID0geyBodHRwR2V0OiB7XG4gICAgICAgIHBvcnQ6IGZsdXhQb3J0LFxuICAgICAgICBwYXRoOlxuICAgICAgICAgICdhcGkvZmx1eC92Ni9pZGVudGl0eS5wdWInLFxuICAgICAgfSxcbiAgICAgIGluaXRpYWxEZWxheVNlY29uZHM6IDUsXG4gICAgICB0aW1lb3V0U2Vjb25kczogNSxcbiAgICB9XG5cbiAgICBjb25zdCB2b2x1bWVzIDogVm9sdW1lW10gPSBbIHtcbiAgICAgIG5hbWU6ICdnaXQta2V5JyxcbiAgICAgIHNlY3JldDoge1xuICAgICAgICBzZWNyZXROYW1lOlxuICAgICAgICAgIG9wdGlvbnMubmFtZSArICctZ2l0LWRlcGxveScsXG4gICAgICAgIGRlZmF1bHRNb2RlOiA0MDAsXG4gICAgICB9LFxuICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdnaXQta2V5Z2VuJyxcbiAgICAgICAgZW1wdHlEaXI6IHsgbWVkaXVtOiAnTWVtb3J5JyB9LFxuICAgICAgfSxdO1xuXG4gICAgbmV3IERlcGxveW1lbnQodGhpcywgb3B0aW9ucy5uYW1lKyAnLWRwJywge1xuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgbmFtZXNwYWNlOiBvcHRpb25zLm5hbWVzcGFjZSxcbiAgICAgICAgbmFtZTogb3B0aW9ucy5uYW1lLFxuICAgICAgfSxcbiAgICAgIHNwZWM6IHtcbiAgICAgICAgcmVwbGljYXM6IDEsXG4gICAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgICAgbWF0Y2hMYWJlbHM6IGxhYmVsLFxuICAgICAgICB9LFxuICAgICAgICBzdHJhdGVneToge1xuICAgICAgICAgIHR5cGU6ICdSZWNyZWF0ZScsXG4gICAgICAgIH0sXG4gICAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgIGxhYmVsczogbGFiZWwsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICBzZXJ2aWNlQWNjb3VudE5hbWU6XG4gICAgICAgICAgICAgIHNlcnZpY2VBY2NvdW50Lm5hbWUsXG4gICAgICAgICAgICB2b2x1bWVzOiB2b2x1bWVzLFxuICAgICAgICAgICAgY29udGFpbmVyczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogb3B0aW9ucy5uYW1lLFxuICAgICAgICAgICAgICAgIGltYWdlOlxuICAgICAgICAgICAgICAgICAgJ2RvY2tlci5pby9mbHV4Y2QvZmx1eDonICtcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnMudGFnLFxuICAgICAgICAgICAgICAgIGltYWdlUHVsbFBvbGljeTogJ0lmTm90UHJlc2VudCcsXG4gICAgICAgICAgICAgICAgcG9ydHM6IFtcbiAgICAgICAgICAgICAgICAgIHsgY29udGFpbmVyUG9ydDogZmx1eFBvcnQgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc291cmNlczoge1xuICAgICAgICAgICAgICAgICAgbGltaXRzOiBsaW1pdHMsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBsaXZlbmVzc1Byb2JlOiBwcm9iZSxcbiAgICAgICAgICAgICAgICByZWFkaW5lc3NQcm9iZTogcHJvYmUsXG4gICAgICAgICAgICAgICAgdm9sdW1lTW91bnRzOiBbXG4gICAgICAgICAgICAgICAgICB7bmFtZTogdm9sdW1lc1swXS5uYW1lLCBtb3VudFBhdGg6ICcvZXRjL2ZsdXhkL3NzaCcgfSxcbiAgICAgICAgICAgICAgICAgIHtuYW1lOiB2b2x1bWVzWzFdLm5hbWUsIG1vdW50UGF0aDogJy9ldGMvZmx1eGQva2V5Z2VuJyB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgYXJnczogb3B0aW9ucy5hcmd1bWVudHNcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBtZW1jYWNoZWROYW1lID0gJ21lbWNhY2hlZCc7XG4gICAgY29uc3QgbWVtY2FjaGVkTGFiZWxzID0geyBuYW1lOiBtZW1jYWNoZWROYW1lfTtcbiAgICBjb25zdCBtZW1jYWNoZWRQb3J0IDogbnVtYmVyID0gMTEyMTE7XG4gICAgbmV3IERlcGxveW1lbnQodGhpcywgb3B0aW9ucy5uYW1lICsgJy1tZW1jYWNoZWQnLCB7XG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBuYW1lOiBtZW1jYWNoZWROYW1lLFxuICAgICAgICBuYW1lc3BhY2U6IG9wdGlvbnMubmFtZXNwYWNlXG4gICAgICB9LFxuICAgICAgc3BlYzoge1xuICAgICAgICByZXBsaWNhczogMSxcbiAgICAgICAgc2VsZWN0b3I6e1xuICAgICAgICAgIG1hdGNoTGFiZWxzOiBtZW1jYWNoZWRMYWJlbHNcbiAgICAgICAgfSxcbiAgICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgbGFiZWxzOiBtZW1jYWNoZWRMYWJlbHMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICBjb250YWluZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBtZW1jYWNoZWROYW1lLFxuICAgICAgICAgICAgICAgIGltYWdlOiAnbWVtY2FjaGVkOjEuNi41JyxcbiAgICAgICAgICAgICAgICBhcmdzOiBbJy1tIDUxMicsICctSSA1bScsICctcCAnICsgbWVtY2FjaGVkUG9ydF0sXG4gICAgICAgICAgICAgICAgcG9ydHM6IFt7XG4gICAgICAgICAgICAgICAgICBuYW1lOiAnY2xpZW50cycsXG4gICAgICAgICAgICAgICAgICBjb250YWluZXJQb3J0OiBtZW1jYWNoZWRQb3J0XG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgc2VjdXJpdHlDb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgICBydW5Bc0dyb3VwOiBtZW1jYWNoZWRQb3J0LFxuICAgICAgICAgICAgICAgICAgcnVuQXNVc2VyOiBtZW1jYWNoZWRQb3J0LFxuICAgICAgICAgICAgICAgICAgYWxsb3dQcml2aWxlZ2VFc2NhbGF0aW9uOiBmYWxzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgICBuZXcgU2VydmljZSh0aGlzLCBtZW1jYWNoZWROYW1lICsgJy1zdmMnLHtcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIG5hbWU6IG1lbWNhY2hlZE5hbWUsXG4gICAgICAgIG5hbWVzcGFjZTogb3B0aW9ucy5uYW1lLFxuICAgICAgfSxcbiAgICAgIHNwZWM6e1xuICAgICAgICBwb3J0czogW3tcbiAgICAgICAgICBwb3J0OiBtZW1jYWNoZWRQb3J0LFxuICAgICAgICAgIG5hbWU6IG1lbWNhY2hlZE5hbWVcbiAgICAgICAgfV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKG9wdGlvbnMucHJvbWV0aGV1c09wZXJhdG9yKSB7XG4gICAgICBuZXcgU2VydmljZSh0aGlzLCBvcHRpb25zLm5hbWUgKyAnLXN2YycsIHtcbiAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICBuYW1lOiBvcHRpb25zLm5hbWUsXG4gICAgICAgICAgbmFtZXNwYWNlOiBvcHRpb25zLm5hbWVzcGFjZSxcbiAgICAgICAgICBsYWJlbHM6IGxhYmVsLFxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgdHlwZTogJ0NsdXN0ZXJJUCcsXG4gICAgICAgICAgcG9ydHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcG9ydDogZmx1eFBvcnQsXG4gICAgICAgICAgICAgIHRhcmdldFBvcnQ6IGZsdXhQb3J0TmFtZSxcbiAgICAgICAgICAgICAgcHJvdG9jb2w6ICdUQ1AnLFxuICAgICAgICAgICAgICBuYW1lOiBmbHV4UG9ydE5hbWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgbmV3IFNlcnZpY2VNb25pdG9yKHRoaXMsIG9wdGlvbnMubmFtZSArJy1zbScsIHtcbiAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICBuYW1lc3BhY2U6IG9wdGlvbnMubmFtZXNwYWNlLFxuICAgICAgICAgIG5hbWU6IG9wdGlvbnMubmFtZSxcbiAgICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAgIFsncHJvbWV0aGV1cyddOiAnbW9uaXRvcmluZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIHNlbGVjdG9yOiB7XG4gICAgICAgICAgICBtYXRjaExhYmVsczogbGFiZWwsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlbmRwb2ludHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaG9ub3JMYWJlbHM6IHRydWUsXG4gICAgICAgICAgICAgIHBvcnQ6IGZsdXhQb3J0TmFtZSxcbiAgICAgICAgICAgICAgcGF0aDogJy9tZXRyaWNzJyxcbiAgICAgICAgICAgICAgaW50ZXJ2YWw6ICczMHMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIG5hbWVzcGFjZVNlbGVjdG9yOiB7XG4gICAgICAgICAgICBtYXRjaE5hbWVzOiBbb3B0aW9ucy5uYW1lc3BhY2VdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
