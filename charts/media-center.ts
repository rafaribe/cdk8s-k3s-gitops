import { App, Chart } from "cdk8s";
import { Construct } from "constructs";
import { Namespace, PersistentVolume, PersistentVolumeClaim, Quantity, StorageClass } from "../imports/k8s";
import { LinuxServerApp } from "../lib/linux-server-app";
//import { LinuxServerApp } from "../lib/linux-server-app";

export class MediaCenter extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);
    const namespace = "media-center";
    const timezone = "Europe/Lisbon";
    new Namespace(this, namespace, {
      metadata: {
        labels: {
          ["name"]: namespace,
        },
        name: namespace,
      },
    });

    const pvDownloadsLabels = { ["directory"]: "downloads" };
    const scEscritorioName = "sc-escritorio";
    const downloadsPVCName = "downloads-pvc";
    new StorageClass(this, scEscritorioName, {
      metadata: {
        name: scEscritorioName,
      },
      volumeBindingMode: "WaitForFirstConsumer",
      provisioner: "kubernetes.io/no-provisioner",
    });

    new PersistentVolume(this, "qbittorrent-downloads-pv", {
      metadata: {
        name: "downloads",
        labels: pvDownloadsLabels,
      },
      spec: {
        storageClassName: scEscritorioName,
        capacity: {
          storage: "3Ti",
        },
        accessModes: ["ReadWriteMany"],
        local: {
          path: "/mnt/data/qb-downloads",
        },
        nodeAffinity: {
          required: {
            nodeSelectorTerms: [
              {
                matchExpressions: [
                  {
                    key: "kubernetes.io/hostname",
                    operator: "In",
                    values: ["escritorio"],
                  },
                ],
              },
            ],
          },
        },
      },
    });

    new PersistentVolumeClaim(this, "qbitorrent-downloads-pvc", {
      metadata: {
        name: downloadsPVCName,
        namespace: namespace,
      },
      spec: {
        selector: { matchLabels: pvDownloadsLabels },
        storageClassName: scEscritorioName,
        accessModes: ["ReadWriteMany"],
        resources: {
          requests: {
            storage: Quantity.fromString("200Gi"),
          },
        },
      },
    });

    new LinuxServerApp(this, "qbittorrent-", {
      ns: namespace,
      name: "qbittorrent",
      volumes: [
        {
          name: "qbittorrent-config",
          path: "/config",
          size: "1Gi",
          reuse: false,
        },
        {
          name: "downloads",
          path: "/downloads",
          size: "200Gi",
          reuse: true,
        },
      ],
      ports: [6881, 8080],
      ipAddress: "192.168.1.232",
      image: "linuxserver/qbittorrent:14.2.0.99201912180418-6819-118af03ubuntu18.04.1-ls62",
      timezone: timezone,
    });

    new LinuxServerApp(this, "jackett-", {
      ns: namespace,
      name: "jackett",
      volumes: [
        {
          name: "jackett-config",
          path: "/config",
          size: "1Gi",
          reuse: false,
        },
        {
          name: downloadsPVCName,
          path: "/downloads",
          size: "200Gi",
          reuse: true,
        },
      ],
      ports: [9117],
      ipAddress: "192.168.1.231",
      image: "linuxserver/jackett:v0.14.49-ls56",
      timezone: timezone,
    });
  }
}
const app = new App();
new MediaCenter(app, "media-center");
app.synth();
