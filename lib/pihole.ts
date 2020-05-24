import { Construct } from "constructs";
import * as process from "process";
import { Deployment, Namespace, Quantity, Secret } from "../imports/k8s";
import { LocalPathPVC } from "./local-path-pvc";
import { MetalLbService } from "./metallb-service";

export interface PiHoleOptions {
  readonly name: string;

  readonly image: string;

  readonly replicas: number;

  readonly timezone: string;

  readonly adminPasswordSecretName?: string;

  readonly publicIp: string;

  readonly ns: string;
}

const constructId = "pihole-" + Math.random().toString(36).slice(2);

export class PiHole extends Construct {
  constructor(scope: Construct, options: PiHoleOptions) {
    super(scope, constructId);

    let labels = {
      ["app"]: "pihole",
    };

    new Namespace(this, options.ns + "-ns", {
      metadata: {
        name: options.ns,
        labels: {
          ["name"]: options.ns,
        },
      },
    });
    let envFromVars: { secretRef: { name: string } }[] = [];
    if (options.adminPasswordSecretName) {
      const piholeSecretName = "pihole-password";

      const password = process.env.SECRET_PIHOLE_PIHOLE_PASSWORD ?? "secret";

      const webPassword = Buffer.from(password).toString("base64");

      new Secret(this, piholeSecretName, {
        metadata: {
          namespace: "pihole",
          name: piholeSecretName,
        },
        data: {
          //Either uses the env var or defaults to secret
          ["WEBPASSWORD"]: webPassword,
        },
      });

      envFromVars = [
        {
          secretRef: { name: options.adminPasswordSecretName },
        },
      ];
    }

    const piholeEtcPvcName = options.name + "-pvc-etc";
    new LocalPathPVC(this, piholeEtcPvcName, {
      accessModes: ["ReadWriteOnce"],
      name: piholeEtcPvcName,
      namespace: options.ns,
      size: "1Gi",
    });

    const piholeDnsmasqPvcName = options.name + "-pvc-dnsmasq";
    new LocalPathPVC(this, piholeDnsmasqPvcName, {
      accessModes: ["ReadWriteOnce"],
      name: piholeDnsmasqPvcName,
      namespace: options.ns,
      size: "1Gi",
    });

    new Deployment(this, options.name + +"-dep", {
      metadata: {
        name: options.name,
        labels: labels,
        namespace: options.ns,
      },
      spec: {
        replicas: options.replicas,
        selector: {
          matchLabels: labels,
        },
        template: {
          metadata: {
            labels: labels,
          },
          spec: {
            containers: [
              {
                name: options.name,
                image: options.image,
                imagePullPolicy: "IfNotPresent",
                resources: {
                  limits: {
                    memory: Quantity.fromString("256Mi"),
                    cpu: Quantity.fromString("200m"),
                  },
                },
                env: [
                  {
                    name: "TZ",
                    value: options.timezone,
                  },
                ],
                envFrom: envFromVars,
              },
            ],
            volumes: [
              {
                name: "pihole-etc",
                persistentVolumeClaim: {
                  claimName: piholeEtcPvcName,
                },
              },
              {
                name: "pihole-dnsmasq",
                persistentVolumeClaim: {
                  claimName: piholeDnsmasqPvcName,
                },
              },
            ],
          },
        },
      },
    });
    new MetalLbService(this, {
      labels: labels,
      ipAddress: "192.168.1.230",
      ports: [80, 53],
      name: options.name,
      namespace: options.ns,
    });
  }
}
