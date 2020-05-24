import { App, Chart } from "cdk8s";
import { Construct } from "constructs";
import { PiHole } from "../lib/pihole";

export class PiholeDaemon extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new PiHole(this, {
      publicIp: "192.168.1.230",
      replicas: 1,
      name: "pihole",
      timezone: "Europe/Lisbon",
      image: "pihole/pihole:beta-v5.0",
      ns: "pihole",
    });
  }
}

const app = new App();
new PiholeDaemon(app, "pihole");
app.synth();
