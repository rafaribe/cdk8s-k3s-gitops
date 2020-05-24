import { Construct } from "constructs";
import { Service, ServicePort } from "../imports/k8s";

export interface MetalLbServiceOptions {
  /**
   * Ports to expose via TCP and UDP
   *
   */
  readonly ports: number[];

  /**
   * Service-Names
   *
   */
  readonly name: string;

  /**
   * Namespace for the service
   *
   */
  readonly namespace: string;
  /**
   * Labels that should match the deployment ones
   *
   */
  readonly labels: { [key: string]: string };

  /**
   * Metallb Layer 2 IP Address
   *
   */
  readonly ipAddress: string;
}

export enum PortProtocol {
  "TCP",
  "UDP",
}

const constructId = "metal-lb.ts-svc-" + Math.random().toString(36).slice(2);

export class MetalLbService extends Construct {
  constructor(scope: Construct, options: MetalLbServiceOptions) {
    super(scope, constructId);
    const tcpPorts: ServicePort[] = this.buildServicePorts(options.ports, PortProtocol.TCP, options.name);
    const udpPorts: ServicePort[] = this.buildServicePorts(options.ports, PortProtocol.UDP, options.name);
    const metalLbAnnotations = {
      ["metallb.universe.tf/allow-shared-ip"]: "true",
    };
    const tcpServiceName = options.name + "-tcp";

    new Service(this, tcpServiceName, {
      metadata: {
        labels: options.labels,
        name: tcpServiceName,
        namespace: options.namespace,
        annotations: metalLbAnnotations,
      },
      spec: {
        selector: options.labels,
        type: "LoadBalancer",
        loadBalancerIP: options.ipAddress,
        ports: tcpPorts,
      },
    });

    const udpServiceName = options.name + "-udp";

    new Service(this, udpServiceName, {
      metadata: {
        labels: options.labels,
        name: udpServiceName,
        namespace: options.namespace,
        annotations: metalLbAnnotations,
      },
      spec: {
        selector: options.labels,
        type: "LoadBalancer",
        loadBalancerIP: options.ipAddress,
        ports: udpPorts,
      },
    });
  }

  private buildServicePorts(ports: number[], protocol: PortProtocol, name: string): ServicePort[] {
    let result: ServicePort[] = [];
    ports.forEach(function (port) {
      if (protocol == PortProtocol.UDP) {
        const udpPort: ServicePort = {
          port: port,
          targetPort: port,
          name: name + "-udp-" + port,
          protocol: "UDP",
        };
        result.push(udpPort);
      } else {
        const tcpPort: ServicePort = {
          port: port,
          targetPort: port,
          name: name + "-tcp-" + port,
          protocol: "TCP",
        };
        result.push(tcpPort);
      }
    });
    return result;
  }
}
