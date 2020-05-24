import { Construct } from "constructs";
import { PersistentVolumeClaim, Quantity } from "../imports/k8s";

export interface LocalPathPvcOptions {
  /**
   * Persistent Volume Claim Size
   *
   * @default 2Gi
   */
  readonly size: string;

  /**
   * Namespace
   *
   */
  readonly namespace: string;

  /**
   * Persistent Volume Claim Name
   *
   * @default 2Gi
   */
  readonly name: string;

  /**
   * Access Modes, can be ReadWriteOnce, ReadWriteMany, ReadOnlyMany
   *
   * @default ReadWriteOnce
   */
  readonly accessModes?: string[];
}

export class LocalPathPVC extends Construct {
  constructor(scope: Construct, constructId: string, options: LocalPathPvcOptions) {
    super(scope, constructId);

    const accessModes: string[] = options.accessModes || ["ReadWriteOnce"];

    new PersistentVolumeClaim(this, options.name, {
      metadata: {
        name: options.name,
        namespace: options.namespace,
      },
      spec: {
        accessModes: accessModes,
        storageClassName: "local-path",
        resources: {
          requests: {
            storage: Quantity.fromString(options.size),
          },
        },
      },
    });
  }
}
