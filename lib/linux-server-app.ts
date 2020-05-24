import { Construct } from "constructs";
import { Deployment, Quantity, Volume, VolumeMount } from "../imports/k8s";
import { LocalPathPVC } from "./local-path-pvc";
import { MetalLbService } from "./metallb-service";

export interface LinuxServerVolumeOptions {
  readonly name: string;
  readonly path: string;
  readonly size: string;
  readonly reuse: boolean;
}

export interface LinuxServerAppOptions {
  readonly name: string;
  readonly ns: string;
  readonly image: string;
  readonly volumes: LinuxServerVolumeOptions[];
  readonly timezone: string;
  readonly ports: number[];
  readonly ipAddress: string;
}
export class LinuxServerApp extends Construct {
  constructor(scope: Construct, constructId: string, options: LinuxServerAppOptions) {
    super(scope, constructId);

    const volumeMounts: VolumeMount[] = buildVolumeMounts(options.volumes);
    const volumes: Volume[] = buildVolumes(options.volumes);
    buildPVC(scope, options.volumes, options.ns);
    const labels = { ["app"]: options.name };

    new Deployment(this, options.name + "-dep", {
      metadata: {
        namespace: options.ns,
        name: options.name,
      },
      spec: {
        selector: { matchLabels: labels },
        template: {
          metadata: {
            labels: labels,
          },
          spec: {
            volumes: volumes,
            containers: [
              {
                name: options.name,
                image: options.image,
                imagePullPolicy: "IfNotPresent",
                resources: {
                  limits: {
                    memory: Quantity.fromString("400Mi"),
                    cpu: Quantity.fromString("100m"),
                  },
                },
                volumeMounts: volumeMounts,
                env: [
                  {
                    name: "TZ",
                    value: options.timezone,
                  },
                  { name: "PUID", value: "1000" },
                  { name: "PGID", value: "1000" },
                  { name: "UMASK_SET", value: "022" },
                ],
              },
            ],
          },
        },
      },
    });

    new MetalLbService(this, {
      ipAddress: options.ipAddress,
      name: options.name,
      namespace: options.ns,
      labels: labels,
      ports: options.ports,
    });
  }
}
function buildVolumeMounts(volumeOptions: LinuxServerVolumeOptions[]): VolumeMount[] {
  let result: VolumeMount[] = [];
  volumeOptions.forEach(function (volume) {
    result.push({
      name: volume.name,
      mountPath: volume.path,
    });
  });
  return result;
}

function buildVolumes(volumeOptions: LinuxServerVolumeOptions[]): Volume[] {
  let result: Volume[] = [];
  volumeOptions.forEach(function (volume) {
    result.push({
      name: volume.name,
      persistentVolumeClaim: {
        claimName: volume.name + "-pvc",
      },
    });
  });
  return result;
}
function buildPVC(scope: Construct, volumeOptions: LinuxServerVolumeOptions[], namespace: string) {
  volumeOptions.forEach(function (volume) {
    if (!volume.reuse) {
      const constructId = volume.name + "-pvc-" + Math.random().toString(36).slice(2);
      new LocalPathPVC(scope, constructId, {
        namespace: namespace,
        name: volume.name + "-pvc",
        size: volume.size,
        accessModes: ["ReadWriteMany"],
      });
    }
    console.log("Reusing Existing PVC instead of creating a new one");
  });
}
