import { App, Chart } from "cdk8s";
import { Construct } from "constructs";
import { Flux } from "cdk8s-flux";

export class FluxDaemon extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new Flux(this, "flux", {
      ns: "flux",
      name: "flux",
      image: "raspbernetes/flux",
      tag: "1.19.0",
      replicas: 1,
      arguments: [
        "--memcached-service=",
        "--ssh-keygen-dir=/etc/fluxd/keygen",
        "--git-url=git@github.com:rafaribe/cdk8s-k3s-gitops",
        "--git-branch=master",
        "--git-path=cluster",
        "--git-label=flux",
        "--git-user=flux",
        "--git-email=flux@rafaribe.com",
        "--git-poll-interval=5m",
        "--sync-garbage-collection",
      ],
    });
  }
}

const app = new App();
new FluxDaemon(app, "flux");
app.synth();
