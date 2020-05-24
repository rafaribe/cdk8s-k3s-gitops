import { App, Chart } from "cdk8s";
import { Construct } from "constructs";
import { Namespace } from "../imports/k8s";
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
          reuse: false,
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
          name: "downloads",
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
