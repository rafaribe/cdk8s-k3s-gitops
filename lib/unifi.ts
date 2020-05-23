import { Construct } from "constructs";
import { Deployment, Namespace, Quantity, Service } from "../imports/k8s";
import { LocalPathPVC } from "./local-path-pvc";

export interface UnifiOptions {
  /**
   * Persistent Volume Claim Size
   *
   * @default Europe/Lisbon
   */
  readonly timezone: string;

  /**
   * Namespace
   *
   * @default unifi
   */
  readonly namespace: string;

  /**
   *  Unifi Controller Name
   *
   * @default 2Gi
   */
  readonly name: string;

  /**
   * Persistent Volume Claim Name
   *
   * @default 2Gi
   */
  readonly imageTag: string;

  /**
   * Metal LB IP address
   *
   * @default 192.168.1.250
   */
  readonly ipAddress: string;
}

const constructId = "unifi-" + Math.random().toString(36).slice(2);

export class Unifi extends Construct {
  constructor(scope: Construct, options: UnifiOptions) {
    super(scope, constructId);

    const accessModes: string[] = ["ReadWriteOnce"];

    const deploymentLabels = {
      ["app"]: "unifi",
    };

    const metadata = {
      namespace: options.namespace,
      name: options.name,
    };
    new Namespace(this, options.namespace + "-ns", {
      metadata: { name: options.namespace },
    });

    new LocalPathPVC(this, {
      accessModes: accessModes,
      name: options.name,
      namespace: options.namespace,
      size: "4Gi",
    });

    new Deployment(this, options.name + "-dp", {
      metadata: metadata,
      spec: {
        selector: {
          matchLabels: deploymentLabels,
        },
        template: {
          metadata: { labels: deploymentLabels },
          spec: {
            volumes: [
              {
                name: "config",
                persistentVolumeClaim: {
                  claimName: options.name,
                },
              },
            ],
            containers: [
              {
                name: options.name,
                image: "linuxserver/unifi-controller:" + options.imageTag,
                resources: {
                  limits: {
                    memory: Quantity.fromString("512Mi"),
                    cpu: Quantity.fromString("500m"),
                  },
                },
                env: [
                  {
                    name: "TZ",
                    value: options.timezone,
                  },
                  { name: "PUID", value: "1000" },
                  { name: "PGID", value: "1000" },
                  {
                    name: "UMASK_SET",
                    value: "022",
                  },
                ],
                volumeMounts: [
                  {
                    name: "config",
                    mountPath: "/config",
                  },
                ],
                ports: [
                  {
                    name: "https",
                    containerPort: 8433,
                  },
                  {
                    name: "http",
                    containerPort: 8080,
                  },
                  {
                    name: "stun",
                    containerPort: 3478,
                    protocol: "UDP",
                  },
                  {
                    name: "speedtest",
                    containerPort: 6789,
                  },
                  {
                    name: "ubnt-discovery",
                    containerPort: 10001,
                    protocol: "UDP",
                  },
                ],
              },
            ],
          },
        },
      },
    });

    const tcpService = options.name + "-tcp";

    const metalLbAnnotations = {
      ["metallb.universe.tf/allow-shared-ip"]: "true",
    };
    new Service(this, tcpService, {
      metadata: {
        labels: deploymentLabels,
        name: tcpService,
        namespace: options.namespace,
        annotations: metalLbAnnotations,
      },
      spec: {
        selector: deploymentLabels,
        type: "LoadBalancer",
        loadBalancerIP: options.ipAddress,
        ports: [
          { port: 8080, name: "uap-inform" },
          {
            port: 8443,
            name: "controller-gui-api",
          },
          { port: 8880, name: "http-redirect" },
          { port: 8843, name: "https-redirect" },
          {
            port: 6789,
            name: "throughput-measurement",
          },
          {
            port: 8881,
            name: "wireless-client-redirector-port1",
          },
          {
            port: 8882,
            name: "wireless-client-redirector-port2",
          },
        ],
      },
    });

    const udpService = options.name + "-udp";

    new Service(this, udpService, {
      metadata: {
        labels: deploymentLabels,
        name: udpService,
        namespace: options.namespace,
        annotations: metalLbAnnotations,
      },
      spec: {
        type: "LoadBalancer",
        loadBalancerIP: options.ipAddress,
        ports: [
          { port: 3478, name: "stun-port", protocol: "UDP" },
          { port: 10001, name: "ap-discovery", protocol: "UDP" },
        ],
      },
    });
  }
}
