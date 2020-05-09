// generated by cdk8s
import { ApiObject } from 'cdk8s';
import { Construct } from 'constructs';

/**
 * HelmRelease is a type to represent a Helm release.
 *
 * @schema HelmRelease
 */
export class HelmRelease extends ApiObject {
  /**
   * Defines a "HelmRelease" API object
   * @param scope the scope in which to define this object
   * @param name a scope-local name for the object
   * @param options configuration options
   */
  public constructor(scope: Construct, name: string, options: HelmReleaseOptions) {
    super(scope, name, {
      ...options,
      kind: 'HelmRelease',
      apiVersion: 'helm.fluxcd.io/v1',
    });
  }
}

/**
 * HelmRelease is a type to represent a Helm release.
 *
 * @schema HelmRelease
 */
export interface HelmReleaseOptions {
  /**
   * @schema HelmRelease#metadata
   */
  readonly metadata: any;

  /**
   * @schema HelmRelease#spec
   */
  readonly spec: HelmReleaseSpec;

}

/**
 * @schema HelmReleaseSpec
 */
export interface HelmReleaseSpec {
  /**
   * @schema HelmReleaseSpec#chart
   */
  readonly chart: HelmReleaseSpecChart;

  /**
   * Force will mark this Helm release to `--force` upgrades. This forces the resource updates through delete/recreate if needed.
   *
   * @schema HelmReleaseSpec#forceUpgrade
   */
  readonly forceUpgrade?: boolean;

  /**
   * HelmVersion is the version of Helm to target. If not supplied, the lowest _enabled Helm version_ will be targeted. Valid HelmVersion values are: "v2", "v3"
   *
   * @schema HelmReleaseSpec#helmVersion
   */
  readonly helmVersion?: string;

  /**
   * MaxHistory is the maximum amount of revisions to keep for the Helm release. If not supplied, it defaults to 10.
   *
   * @schema HelmReleaseSpec#maxHistory
   */
  readonly maxHistory?: number;

  /**
   * ReleaseName is the name of the The Helm release. If not supplied, it will be generated by affixing the namespace to the resource name.
   *
   * @schema HelmReleaseSpec#releaseName
   */
  readonly releaseName?: string;

  /**
   * ResetValues will mark this Helm release to reset the values to the defaults of the targeted chart before performing an upgrade. Not explicitly setting this to `false` equals to `true` due to the declarative nature of the operator.
   *
   * @schema HelmReleaseSpec#resetValues
   */
  readonly resetValues?: boolean;

  /**
   * The rollback settings for this Helm release.
   *
   * @schema HelmReleaseSpec#rollback
   */
  readonly rollback?: HelmReleaseSpecRollback;

  /**
   * SkipCRDs will mark this Helm release to skip the creation of CRDs during a Helm 3 installation.
   *
   * @schema HelmReleaseSpec#skipCRDs
   */
  readonly skipCRDs?: boolean;

  /**
   * TargetNamespace overrides the targeted namespace for the Helm release. The default namespace equals to the namespace of the HelmRelease resource.
   *
   * @schema HelmReleaseSpec#targetNamespace
   */
  readonly targetNamespace?: string;

  /**
   * Timeout is the time to wait for any individual Kubernetes operation (like Jobs for hooks) during installation and upgrade operations.
   *
   * @schema HelmReleaseSpec#timeout
   */
  readonly timeout?: number;

  /**
   * ValueFileSecrets holds the local name references to secrets. DEPRECATED, use ValuesFrom.secretKeyRef instead.
   *
   * @schema HelmReleaseSpec#valueFileSecrets
   */
  readonly valueFileSecrets?: HelmReleaseSpecValueFileSecrets[];

  /**
   * Values holds the values for this Helm release.
   *
   * @schema HelmReleaseSpec#values
   */
  readonly values?: any;

  /**
   * @schema HelmReleaseSpec#valuesFrom
   */
  readonly valuesFrom?: HelmReleaseSpecValuesFrom[];

  /**
   * Wait will mark this Helm release to wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful.
   *
   * @schema HelmReleaseSpec#wait
   */
  readonly wait?: boolean;

}

/**
 * @schema HelmReleaseSpecChart
 */
export interface HelmReleaseSpecChart {
  /**
   * ChartPullSecret holds the reference to the authentication secret for accessing the Helm repository using HTTPS basic auth. NOT IMPLEMENTED!
   *
   * @schema HelmReleaseSpecChart#chartPullSecret
   */
  readonly chartPullSecret?: HelmReleaseSpecChartChartPullSecret;

  /**
   * Git URL is the URL of the Git repository, e.g. `git@github.com:org/repo`, `http://github.com/org/repo`, or `ssh://git@example.com:2222/org/repo.git`.
   *
   * @schema HelmReleaseSpecChart#git
   */
  readonly git?: string;

  /**
   * Name is the name of the Helm chart _without_ an alias, e.g. redis (for `helm upgrade [flags] stable/redis`).
   *
   * @schema HelmReleaseSpecChart#name
   */
  readonly name?: string;

  /**
   * Path is the path to the chart relative to the repository root.
   *
   * @schema HelmReleaseSpecChart#path
   */
  readonly path?: string;

  /**
   * Ref is the Git branch (or other reference) to use. Defaults to 'master', or the configured default Git ref.
   *
   * @default master', or the configured default Git ref.
   * @schema HelmReleaseSpecChart#ref
   */
  readonly ref?: string;

  /**
   * RepoURL is the URL of the Helm repository, e.g. `https://kubernetes-charts.storage.googleapis.com` or `https://charts.example.com`.
   *
   * @schema HelmReleaseSpecChart#repository
   */
  readonly repository?: string;

  /**
   * SecretRef holds the authentication secret for accessing the Git repository (over HTTPS). The credentials will be added to an HTTPS GitURL before the mirror is started.
   *
   * @schema HelmReleaseSpecChart#secretRef
   */
  readonly secretRef?: HelmReleaseSpecChartSecretRef;

  /**
   * SkipDepUpdate will tell the operator to skip running 'helm dep update' before installing or upgrading the chart, the chart dependencies _must_ be present for this to succeed.
   *
   * @schema HelmReleaseSpecChart#skipDepUpdate
   */
  readonly skipDepUpdate?: boolean;

  /**
   * Version is the targeted Helm chart version, e.g. 7.0.1.
   *
   * @schema HelmReleaseSpecChart#version
   */
  readonly version?: string;

}

/**
 * The rollback settings for this Helm release.
 *
 * @schema HelmReleaseSpecRollback
 */
export interface HelmReleaseSpecRollback {
  /**
   * DisableHooks will mark this Helm release to prevent hooks from running during the rollback.
   *
   * @schema HelmReleaseSpecRollback#disableHooks
   */
  readonly disableHooks?: boolean;

  /**
   * Enable will mark this Helm release for rollbacks.
   *
   * @schema HelmReleaseSpecRollback#enable
   */
  readonly enable?: boolean;

  /**
   * Force will mark this Helm release to `--force` rollbacks. This forces the resource updates through delete/recreate if needed.
   *
   * @schema HelmReleaseSpecRollback#force
   */
  readonly force?: boolean;

  /**
   * MaxRetries is the maximum amount of upgrade retries the operator should make before bailing.
   *
   * @schema HelmReleaseSpecRollback#maxRetries
   */
  readonly maxRetries?: number;

  /**
   * Recreate will mark this Helm release to `--recreate-pods` for if applicable. This performs pod restarts.
   *
   * @schema HelmReleaseSpecRollback#recreate
   */
  readonly recreate?: boolean;

  /**
   * Retry will mark this Helm release for upgrade retries after a rollback.
   *
   * @schema HelmReleaseSpecRollback#retry
   */
  readonly retry?: boolean;

  /**
   * Timeout is the time to wait for any individual Kubernetes operation (like Jobs for hooks) during rollback.
   *
   * @schema HelmReleaseSpecRollback#timeout
   */
  readonly timeout?: number;

  /**
   * Wait will mark this Helm release to wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful.
   *
   * @schema HelmReleaseSpecRollback#wait
   */
  readonly wait?: boolean;

}

/**
 * @schema HelmReleaseSpecValueFileSecrets
 */
export interface HelmReleaseSpecValueFileSecrets {
  /**
   * @schema HelmReleaseSpecValueFileSecrets#name
   */
  readonly name: string;

}

/**
 * @schema HelmReleaseSpecValuesFrom
 */
export interface HelmReleaseSpecValuesFrom {
  /**
   * The reference to a local chart file with release values.
   *
   * @schema HelmReleaseSpecValuesFrom#chartFileRef
   */
  readonly chartFileRef?: HelmReleaseSpecValuesFromChartFileRef;

  /**
   * The reference to a config map with release values.
   *
   * @schema HelmReleaseSpecValuesFrom#configMapKeyRef
   */
  readonly configMapKeyRef?: HelmReleaseSpecValuesFromConfigMapKeyRef;

  /**
   * The reference to an external source with release values.
   *
   * @schema HelmReleaseSpecValuesFrom#externalSourceRef
   */
  readonly externalSourceRef?: HelmReleaseSpecValuesFromExternalSourceRef;

  /**
   * The reference to a secret with release values.
   *
   * @schema HelmReleaseSpecValuesFrom#secretKeyRef
   */
  readonly secretKeyRef?: HelmReleaseSpecValuesFromSecretKeyRef;

}

/**
 * ChartPullSecret holds the reference to the authentication secret for accessing the Helm repository using HTTPS basic auth. NOT IMPLEMENTED!
 *
 * @schema HelmReleaseSpecChartChartPullSecret
 */
export interface HelmReleaseSpecChartChartPullSecret {
  /**
   * @schema HelmReleaseSpecChartChartPullSecret#name
   */
  readonly name: string;

}

/**
 * SecretRef holds the authentication secret for accessing the Git repository (over HTTPS). The credentials will be added to an HTTPS GitURL before the mirror is started.
 *
 * @schema HelmReleaseSpecChartSecretRef
 */
export interface HelmReleaseSpecChartSecretRef {
  /**
   * @schema HelmReleaseSpecChartSecretRef#name
   */
  readonly name: string;

}

/**
 * The reference to a local chart file with release values.
 *
 * @schema HelmReleaseSpecValuesFromChartFileRef
 */
export interface HelmReleaseSpecValuesFromChartFileRef {
  /**
   * Optional will mark this ChartFileSelector as optional. The result of this are that operations are permitted without the source, due to it e.g. being temporarily unavailable.
   *
   * @schema HelmReleaseSpecValuesFromChartFileRef#optional
   */
  readonly optional?: boolean;

  /**
   * Path is the file path to the source relative to the chart root.
   *
   * @schema HelmReleaseSpecValuesFromChartFileRef#path
   */
  readonly path: string;

}

/**
 * The reference to a config map with release values.
 *
 * @schema HelmReleaseSpecValuesFromConfigMapKeyRef
 */
export interface HelmReleaseSpecValuesFromConfigMapKeyRef {
  /**
   * @schema HelmReleaseSpecValuesFromConfigMapKeyRef#key
   */
  readonly key?: string;

  /**
   * @schema HelmReleaseSpecValuesFromConfigMapKeyRef#name
   */
  readonly name: string;

  /**
   * @schema HelmReleaseSpecValuesFromConfigMapKeyRef#namespace
   */
  readonly namespace?: string;

  /**
   * @schema HelmReleaseSpecValuesFromConfigMapKeyRef#optional
   */
  readonly optional?: boolean;

}

/**
 * The reference to an external source with release values.
 *
 * @schema HelmReleaseSpecValuesFromExternalSourceRef
 */
export interface HelmReleaseSpecValuesFromExternalSourceRef {
  /**
   * Optional will mark this ExternalSourceSelector as optional. The result of this are that operations are permitted without the source, due to it e.g. being temporarily unavailable.
   *
   * @schema HelmReleaseSpecValuesFromExternalSourceRef#optional
   */
  readonly optional?: boolean;

  /**
   * URL is the URL of the external source.
   *
   * @schema HelmReleaseSpecValuesFromExternalSourceRef#url
   */
  readonly url: string;

}

/**
 * The reference to a secret with release values.
 *
 * @schema HelmReleaseSpecValuesFromSecretKeyRef
 */
export interface HelmReleaseSpecValuesFromSecretKeyRef {
  /**
   * @schema HelmReleaseSpecValuesFromSecretKeyRef#key
   */
  readonly key?: string;

  /**
   * @schema HelmReleaseSpecValuesFromSecretKeyRef#name
   */
  readonly name: string;

  /**
   * @schema HelmReleaseSpecValuesFromSecretKeyRef#namespace
   */
  readonly namespace?: string;

  /**
   * @schema HelmReleaseSpecValuesFromSecretKeyRef#optional
   */
  readonly optional?: boolean;

}

