import { Construct } from 'constructs';
export interface FluxOptions {
  /**
   * The tag for the flux image
   */
  readonly tag: string;
  /**
   * The name for the flux container
   */
  readonly name: string;
  /**
   * The Namespace that should be used for the resources
   */
  readonly namespace: string;
  /**
   * Number of replicas.
   *
   * @default 1
   */
  readonly replicas?: number;
  /**
   * Flux Arguments
   *
   * @defaul
   */
  readonly arguments: string[];
  /**
   * Deploy prometheus operator?
   *
   * @default false
   */
  readonly prometheusOperator: boolean;
}
export declare class Flux extends Construct {
  constructor(
    scope: Construct,
    constructId: string,
    options: FluxOptions,
  );
}
