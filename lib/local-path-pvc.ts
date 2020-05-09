import { Construct } from 'constructs';
import { PersistentVolumeClaim,  Quantity} from '../imports/k8s';

export interface LocalPathPvcOptions {
  /**
   * Persistent Volume Claim Size
   *
   * @default 2Gi
   */
  readonly size: string;

  /**
   * Persistent Volume Claim Size
   *
   * @default 2Gi
   */
  readonly namespace: string;

  /**
   * Persistent Volume Claim Name
   *
   * @default 2Gi
   */
  readonly name: string;

  /**
   * Persistent Volume Claim Name
   *
   * @default 2Gi
   */
  readonly accessModes: string[];
}

const constructId = 'local-path-pvc-' + Math.random().toString(36).slice(2)

export class LocalPathPVC extends Construct {
  constructor(
    scope: Construct,
    options: LocalPathPvcOptions,
  ) {
    super(scope, constructId);

    const accessModes : string[] = options.accessModes || ['ReadWriteMany'];

    new PersistentVolumeClaim(this, options.name, {
      metadata: {
        name: options.name,
        namespace: options.namespace,
      },
      spec: {
        accessModes: accessModes,
        storageClassName: 'local-path',
        resources:{
          requests: { 'storage': Quantity.fromString(options.size) }
        }
      }
    });

  }
}
