import { ApiObject } from 'cdk8s';
import { Construct } from 'constructs';
/**
 * ServiceMonitor defines monitoring for a set of services.
 *
 * @schema ServiceMonitor
 */
export declare class ServiceMonitor extends ApiObject {
    /**
     * Defines a "ServiceMonitor" API object
     * @param scope the scope in which to define this object
     * @param name a scope-local name for the object
     * @param options configuration options
     */
    constructor(scope: Construct, name: string, options: ServiceMonitorOptions);
}
/**
 * ServiceMonitor defines monitoring for a set of services.
 *
 * @schema ServiceMonitor
 */
export interface ServiceMonitorOptions {
    /**
     * @schema ServiceMonitor#metadata
     */
    readonly metadata?: any;
    /**
     * Specification of desired Service selection for target discovery by Prometheus.
     *
     * @schema ServiceMonitor#spec
     */
    readonly spec: ServiceMonitorSpec;
}
/**
 * Specification of desired Service selection for target discovery by Prometheus.
 *
 * @schema ServiceMonitorSpec
 */
export interface ServiceMonitorSpec {
    /**
     * A list of endpoints allowed as part of this ServiceMonitor.
     *
     * @schema ServiceMonitorSpec#endpoints
     */
    readonly endpoints: ServiceMonitorSpecEndpoints[];
    /**
     * The label to use to retrieve the job name from.
     *
     * @schema ServiceMonitorSpec#jobLabel
     */
    readonly jobLabel?: string;
    /**
     * Selector to select which namespaces the Endpoints objects are discovered from.
     *
     * @schema ServiceMonitorSpec#namespaceSelector
     */
    readonly namespaceSelector?: ServiceMonitorSpecNamespaceSelector;
    /**
     * PodTargetLabels transfers labels on the Kubernetes Pod onto the target.
     *
     * @schema ServiceMonitorSpec#podTargetLabels
     */
    readonly podTargetLabels?: string[];
    /**
     * SampleLimit defines per-scrape limit on number of scraped samples that will be accepted.
     *
     * @schema ServiceMonitorSpec#sampleLimit
     */
    readonly sampleLimit?: number;
    /**
     * Selector to select Endpoints objects.
     *
     * @schema ServiceMonitorSpec#selector
     */
    readonly selector: ServiceMonitorSpecSelector;
    /**
     * TargetLabels transfers labels on the Kubernetes Service onto the target.
     *
     * @schema ServiceMonitorSpec#targetLabels
     */
    readonly targetLabels?: string[];
}
/**
 * Endpoint defines a scrapeable endpoint serving Prometheus metrics.
 *
 * @schema ServiceMonitorSpecEndpoints
 */
export interface ServiceMonitorSpecEndpoints {
    /**
     * BasicAuth allow an endpoint to authenticate over basic authentication More info: https://prometheus.io/docs/operating/configuration/#endpoints
     *
     * @schema ServiceMonitorSpecEndpoints#basicAuth
     */
    readonly basicAuth?: ServiceMonitorSpecEndpointsBasicAuth;
    /**
     * File to read bearer token for scraping targets.
     *
     * @schema ServiceMonitorSpecEndpoints#bearerTokenFile
     */
    readonly bearerTokenFile?: string;
    /**
     * Secret to mount to read bearer token for scraping targets. The secret needs to be in the same namespace as the service monitor and accessible by the Prometheus Operator.
     *
     * @schema ServiceMonitorSpecEndpoints#bearerTokenSecret
     */
    readonly bearerTokenSecret?: ServiceMonitorSpecEndpointsBearerTokenSecret;
    /**
     * HonorLabels chooses the metric's labels on collisions with target labels.
     *
     * @schema ServiceMonitorSpecEndpoints#honorLabels
     */
    readonly honorLabels?: boolean;
    /**
     * HonorTimestamps controls whether Prometheus respects the timestamps present in scraped data.
     *
     * @schema ServiceMonitorSpecEndpoints#honorTimestamps
     */
    readonly honorTimestamps?: boolean;
    /**
     * Interval at which metrics should be scraped
     *
     * @schema ServiceMonitorSpecEndpoints#interval
     */
    readonly interval?: string;
    /**
     * MetricRelabelConfigs to apply to samples before ingestion.
     *
     * @schema ServiceMonitorSpecEndpoints#metricRelabelings
     */
    readonly metricRelabelings?: ServiceMonitorSpecEndpointsMetricRelabelings[];
    /**
     * Optional HTTP URL parameters
     *
     * @schema ServiceMonitorSpecEndpoints#params
     */
    readonly params?: {
        [key: string]: string[];
    };
    /**
     * HTTP path to scrape for metrics.
     *
     * @schema ServiceMonitorSpecEndpoints#path
     */
    readonly path?: string;
    /**
     * Name of the service port this endpoint refers to. Mutually exclusive with targetPort.
     *
     * @schema ServiceMonitorSpecEndpoints#port
     */
    readonly port?: string;
    /**
     * ProxyURL eg http://proxyserver:2195 Directs scrapes to proxy through this endpoint.
     *
     * @schema ServiceMonitorSpecEndpoints#proxyUrl
     */
    readonly proxyUrl?: string;
    /**
     * RelabelConfigs to apply to samples before scraping. More info: https://prometheus.io/docs/prometheus/latest/configuration/configuration/#relabel_config
     *
     * @schema ServiceMonitorSpecEndpoints#relabelings
     */
    readonly relabelings?: ServiceMonitorSpecEndpointsRelabelings[];
    /**
     * HTTP scheme to use for scraping.
     *
     * @schema ServiceMonitorSpecEndpoints#scheme
     */
    readonly scheme?: string;
    /**
     * Timeout after which the scrape is ended
     *
     * @schema ServiceMonitorSpecEndpoints#scrapeTimeout
     */
    readonly scrapeTimeout?: string;
    /**
     * Name or number of the pod port this endpoint refers to. Mutually exclusive with port.
     *
     * @schema ServiceMonitorSpecEndpoints#targetPort
     */
    readonly targetPort?: ServiceMonitorSpecEndpointsTargetPort;
    /**
     * TLS configuration to use when scraping the endpoint
     *
     * @schema ServiceMonitorSpecEndpoints#tlsConfig
     */
    readonly tlsConfig?: ServiceMonitorSpecEndpointsTlsConfig;
}
/**
 * Selector to select which namespaces the Endpoints objects are discovered from.
 *
 * @schema ServiceMonitorSpecNamespaceSelector
 */
export interface ServiceMonitorSpecNamespaceSelector {
    /**
     * Boolean describing whether all namespaces are selected in contrast to a list restricting them.
     *
     * @schema ServiceMonitorSpecNamespaceSelector#any
     */
    readonly any?: boolean;
    /**
     * List of namespace names.
     *
     * @schema ServiceMonitorSpecNamespaceSelector#matchNames
     */
    readonly matchNames?: string[];
}
/**
 * Selector to select Endpoints objects.
 *
 * @schema ServiceMonitorSpecSelector
 */
export interface ServiceMonitorSpecSelector {
    /**
     * matchExpressions is a list of label selector requirements. The requirements are ANDed.
     *
     * @schema ServiceMonitorSpecSelector#matchExpressions
     */
    readonly matchExpressions?: ServiceMonitorSpecSelectorMatchExpressions[];
    /**
     * matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed.
     *
     * @schema ServiceMonitorSpecSelector#matchLabels
     */
    readonly matchLabels?: {
        [key: string]: string;
    };
}
/**
 * BasicAuth allow an endpoint to authenticate over basic authentication More info: https://prometheus.io/docs/operating/configuration/#endpoints
 *
 * @schema ServiceMonitorSpecEndpointsBasicAuth
 */
export interface ServiceMonitorSpecEndpointsBasicAuth {
    /**
     * The secret in the service monitor namespace that contains the password for authentication.
     *
     * @schema ServiceMonitorSpecEndpointsBasicAuth#password
     */
    readonly password?: ServiceMonitorSpecEndpointsBasicAuthPassword;
    /**
     * The secret in the service monitor namespace that contains the username for authentication.
     *
     * @schema ServiceMonitorSpecEndpointsBasicAuth#username
     */
    readonly username?: ServiceMonitorSpecEndpointsBasicAuthUsername;
}
/**
 * Secret to mount to read bearer token for scraping targets. The secret needs to be in the same namespace as the service monitor and accessible by the Prometheus Operator.
 *
 * @schema ServiceMonitorSpecEndpointsBearerTokenSecret
 */
export interface ServiceMonitorSpecEndpointsBearerTokenSecret {
    /**
     * The key of the secret to select from.  Must be a valid secret key.
     *
     * @schema ServiceMonitorSpecEndpointsBearerTokenSecret#key
     */
    readonly key: string;
    /**
     * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid?
     *
     * @schema ServiceMonitorSpecEndpointsBearerTokenSecret#name
     */
    readonly name?: string;
    /**
     * Specify whether the Secret or its key must be defined
     *
     * @schema ServiceMonitorSpecEndpointsBearerTokenSecret#optional
     */
    readonly optional?: boolean;
}
/**
 * RelabelConfig allows dynamic rewriting of the label set, being applied to samples before ingestion. It defines `<metric_relabel_configs>`-section of Prometheus configuration. More info: https://prometheus.io/docs/prometheus/latest/configuration/configuration/#metric_relabel_configs
 *
 * @schema ServiceMonitorSpecEndpointsMetricRelabelings
 */
export interface ServiceMonitorSpecEndpointsMetricRelabelings {
    /**
     * Action to perform based on regex matching. Default is 'replace'
     *
     * @default replace'
     * @schema ServiceMonitorSpecEndpointsMetricRelabelings#action
     */
    readonly action?: string;
    /**
     * Modulus to take of the hash of the source label values.
     *
     * @schema ServiceMonitorSpecEndpointsMetricRelabelings#modulus
     */
    readonly modulus?: number;
    /**
     * Regular expression against which the extracted value is matched. Default is '(.*)'
     *
     * @default '
     * @schema ServiceMonitorSpecEndpointsMetricRelabelings#regex
     */
    readonly regex?: string;
    /**
     * Replacement value against which a regex replace is performed if the regular expression matches. Regex capture groups are available. Default is '$1'
     *
     * @default 1'
     * @schema ServiceMonitorSpecEndpointsMetricRelabelings#replacement
     */
    readonly replacement?: string;
    /**
     * Separator placed between concatenated source label values. default is ';'.
     *
     * @schema ServiceMonitorSpecEndpointsMetricRelabelings#separator
     */
    readonly separator?: string;
    /**
     * The source labels select values from existing labels. Their content is concatenated using the configured separator and matched against the configured regular expression for the replace, keep, and drop actions.
     *
     * @schema ServiceMonitorSpecEndpointsMetricRelabelings#sourceLabels
     */
    readonly sourceLabels?: string[];
    /**
     * Label to which the resulting value is written in a replace action. It is mandatory for replace actions. Regex capture groups are available.
     *
     * @schema ServiceMonitorSpecEndpointsMetricRelabelings#targetLabel
     */
    readonly targetLabel?: string;
}
/**
 * RelabelConfig allows dynamic rewriting of the label set, being applied to samples before ingestion. It defines `<metric_relabel_configs>`-section of Prometheus configuration. More info: https://prometheus.io/docs/prometheus/latest/configuration/configuration/#metric_relabel_configs
 *
 * @schema ServiceMonitorSpecEndpointsRelabelings
 */
export interface ServiceMonitorSpecEndpointsRelabelings {
    /**
     * Action to perform based on regex matching. Default is 'replace'
     *
     * @default replace'
     * @schema ServiceMonitorSpecEndpointsRelabelings#action
     */
    readonly action?: string;
    /**
     * Modulus to take of the hash of the source label values.
     *
     * @schema ServiceMonitorSpecEndpointsRelabelings#modulus
     */
    readonly modulus?: number;
    /**
     * Regular expression against which the extracted value is matched. Default is '(.*)'
     *
     * @default '
     * @schema ServiceMonitorSpecEndpointsRelabelings#regex
     */
    readonly regex?: string;
    /**
     * Replacement value against which a regex replace is performed if the regular expression matches. Regex capture groups are available. Default is '$1'
     *
     * @default 1'
     * @schema ServiceMonitorSpecEndpointsRelabelings#replacement
     */
    readonly replacement?: string;
    /**
     * Separator placed between concatenated source label values. default is ';'.
     *
     * @schema ServiceMonitorSpecEndpointsRelabelings#separator
     */
    readonly separator?: string;
    /**
     * The source labels select values from existing labels. Their content is concatenated using the configured separator and matched against the configured regular expression for the replace, keep, and drop actions.
     *
     * @schema ServiceMonitorSpecEndpointsRelabelings#sourceLabels
     */
    readonly sourceLabels?: string[];
    /**
     * Label to which the resulting value is written in a replace action. It is mandatory for replace actions. Regex capture groups are available.
     *
     * @schema ServiceMonitorSpecEndpointsRelabelings#targetLabel
     */
    readonly targetLabel?: string;
}
/**
 * Name or number of the pod port this endpoint refers to. Mutually exclusive with port.
 *
 * @schema ServiceMonitorSpecEndpointsTargetPort
 */
export declare class ServiceMonitorSpecEndpointsTargetPort {
    static fromNumber(value: number): ServiceMonitorSpecEndpointsTargetPort;
    static fromString(value: string): ServiceMonitorSpecEndpointsTargetPort;
    private constructor();
}
/**
 * TLS configuration to use when scraping the endpoint
 *
 * @schema ServiceMonitorSpecEndpointsTlsConfig
 */
export interface ServiceMonitorSpecEndpointsTlsConfig {
    /**
     * Stuct containing the CA cert to use for the targets.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfig#ca
     */
    readonly ca?: ServiceMonitorSpecEndpointsTlsConfigCa;
    /**
     * Path to the CA cert in the Prometheus container to use for the targets.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfig#caFile
     */
    readonly caFile?: string;
    /**
     * Struct containing the client cert file for the targets.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfig#cert
     */
    readonly cert?: ServiceMonitorSpecEndpointsTlsConfigCert;
    /**
     * Path to the client cert file in the Prometheus container for the targets.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfig#certFile
     */
    readonly certFile?: string;
    /**
     * Disable target certificate validation.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfig#insecureSkipVerify
     */
    readonly insecureSkipVerify?: boolean;
    /**
     * Path to the client key file in the Prometheus container for the targets.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfig#keyFile
     */
    readonly keyFile?: string;
    /**
     * Secret containing the client key file for the targets.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfig#keySecret
     */
    readonly keySecret?: ServiceMonitorSpecEndpointsTlsConfigKeySecret;
    /**
     * Used to verify the hostname for the targets.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfig#serverName
     */
    readonly serverName?: string;
}
/**
 * A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.
 *
 * @schema ServiceMonitorSpecSelectorMatchExpressions
 */
export interface ServiceMonitorSpecSelectorMatchExpressions {
    /**
     * key is the label key that the selector applies to.
     *
     * @schema ServiceMonitorSpecSelectorMatchExpressions#key
     */
    readonly key: string;
    /**
     * operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.
     *
     * @schema ServiceMonitorSpecSelectorMatchExpressions#operator
     */
    readonly operator: string;
    /**
     * values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.
     *
     * @schema ServiceMonitorSpecSelectorMatchExpressions#values
     */
    readonly values?: string[];
}
/**
 * The secret in the service monitor namespace that contains the password for authentication.
 *
 * @schema ServiceMonitorSpecEndpointsBasicAuthPassword
 */
export interface ServiceMonitorSpecEndpointsBasicAuthPassword {
    /**
     * The key of the secret to select from.  Must be a valid secret key.
     *
     * @schema ServiceMonitorSpecEndpointsBasicAuthPassword#key
     */
    readonly key: string;
    /**
     * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid?
     *
     * @schema ServiceMonitorSpecEndpointsBasicAuthPassword#name
     */
    readonly name?: string;
    /**
     * Specify whether the Secret or its key must be defined
     *
     * @schema ServiceMonitorSpecEndpointsBasicAuthPassword#optional
     */
    readonly optional?: boolean;
}
/**
 * The secret in the service monitor namespace that contains the username for authentication.
 *
 * @schema ServiceMonitorSpecEndpointsBasicAuthUsername
 */
export interface ServiceMonitorSpecEndpointsBasicAuthUsername {
    /**
     * The key of the secret to select from.  Must be a valid secret key.
     *
     * @schema ServiceMonitorSpecEndpointsBasicAuthUsername#key
     */
    readonly key: string;
    /**
     * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid?
     *
     * @schema ServiceMonitorSpecEndpointsBasicAuthUsername#name
     */
    readonly name?: string;
    /**
     * Specify whether the Secret or its key must be defined
     *
     * @schema ServiceMonitorSpecEndpointsBasicAuthUsername#optional
     */
    readonly optional?: boolean;
}
/**
 * Stuct containing the CA cert to use for the targets.
 *
 * @schema ServiceMonitorSpecEndpointsTlsConfigCa
 */
export interface ServiceMonitorSpecEndpointsTlsConfigCa {
    /**
     * ConfigMap containing data to use for the targets.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCa#configMap
     */
    readonly configMap?: ServiceMonitorSpecEndpointsTlsConfigCaConfigMap;
    /**
     * Secret containing data to use for the targets.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCa#secret
     */
    readonly secret?: ServiceMonitorSpecEndpointsTlsConfigCaSecret;
}
/**
 * Struct containing the client cert file for the targets.
 *
 * @schema ServiceMonitorSpecEndpointsTlsConfigCert
 */
export interface ServiceMonitorSpecEndpointsTlsConfigCert {
    /**
     * ConfigMap containing data to use for the targets.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCert#configMap
     */
    readonly configMap?: ServiceMonitorSpecEndpointsTlsConfigCertConfigMap;
    /**
     * Secret containing data to use for the targets.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCert#secret
     */
    readonly secret?: ServiceMonitorSpecEndpointsTlsConfigCertSecret;
}
/**
 * Secret containing the client key file for the targets.
 *
 * @schema ServiceMonitorSpecEndpointsTlsConfigKeySecret
 */
export interface ServiceMonitorSpecEndpointsTlsConfigKeySecret {
    /**
     * The key of the secret to select from.  Must be a valid secret key.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigKeySecret#key
     */
    readonly key: string;
    /**
     * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid?
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigKeySecret#name
     */
    readonly name?: string;
    /**
     * Specify whether the Secret or its key must be defined
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigKeySecret#optional
     */
    readonly optional?: boolean;
}
/**
 * ConfigMap containing data to use for the targets.
 *
 * @schema ServiceMonitorSpecEndpointsTlsConfigCaConfigMap
 */
export interface ServiceMonitorSpecEndpointsTlsConfigCaConfigMap {
    /**
     * The key to select.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCaConfigMap#key
     */
    readonly key: string;
    /**
     * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid?
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCaConfigMap#name
     */
    readonly name?: string;
    /**
     * Specify whether the ConfigMap or its key must be defined
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCaConfigMap#optional
     */
    readonly optional?: boolean;
}
/**
 * Secret containing data to use for the targets.
 *
 * @schema ServiceMonitorSpecEndpointsTlsConfigCaSecret
 */
export interface ServiceMonitorSpecEndpointsTlsConfigCaSecret {
    /**
     * The key of the secret to select from.  Must be a valid secret key.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCaSecret#key
     */
    readonly key: string;
    /**
     * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid?
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCaSecret#name
     */
    readonly name?: string;
    /**
     * Specify whether the Secret or its key must be defined
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCaSecret#optional
     */
    readonly optional?: boolean;
}
/**
 * ConfigMap containing data to use for the targets.
 *
 * @schema ServiceMonitorSpecEndpointsTlsConfigCertConfigMap
 */
export interface ServiceMonitorSpecEndpointsTlsConfigCertConfigMap {
    /**
     * The key to select.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCertConfigMap#key
     */
    readonly key: string;
    /**
     * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid?
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCertConfigMap#name
     */
    readonly name?: string;
    /**
     * Specify whether the ConfigMap or its key must be defined
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCertConfigMap#optional
     */
    readonly optional?: boolean;
}
/**
 * Secret containing data to use for the targets.
 *
 * @schema ServiceMonitorSpecEndpointsTlsConfigCertSecret
 */
export interface ServiceMonitorSpecEndpointsTlsConfigCertSecret {
    /**
     * The key of the secret to select from.  Must be a valid secret key.
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCertSecret#key
     */
    readonly key: string;
    /**
     * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names TODO: Add other useful fields. apiVersion, kind, uid?
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCertSecret#name
     */
    readonly name?: string;
    /**
     * Specify whether the Secret or its key must be defined
     *
     * @schema ServiceMonitorSpecEndpointsTlsConfigCertSecret#optional
     */
    readonly optional?: boolean;
}
