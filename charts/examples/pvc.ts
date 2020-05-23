import { App, Chart } from "cdk8s";
import { Construct } from "constructs";
import { LocalPathPVC } from "../../lib/local-path-pvc";

export class PVC extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);
    const accessModes: string[] = ["ReadWriteMany"];
    new LocalPathPVC(this, {
      accessModes: accessModes,
      name: "t",
      namespace: "local-path-test",
      size: "10Gi",
    });
  }
}

const app = new App();
new PVC(app, "pvcteste");
//app.synth();
