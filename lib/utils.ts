import { ServicePort } from "../imports/k8s";
import { PortOptions } from "./exposed-app";
import { PortProtocol } from "./metallb-service";

export function ensureTargetPortsAreFilled(ports: PortOptions[]) {
  ports.forEach(function (value) {
    if (!value.targetPort) {
      value.targetPort = value.port;
    }
  });
}

export interface SimplifiedServicePorts {
  port: number;
  targetPort: number;
}

export function buildServicePorts(
  ports: SimplifiedServicePorts[],
  protocol: PortProtocol,
  name: string,
): ServicePort[] {
  let result: ServicePort[] = [];
  ports.forEach(function (port) {
    if (protocol == PortProtocol.UDP) {
      const udpPort: ServicePort = {
        port: port.port,
        targetPort: port.targetPort,
        name: name + "-udp-" + port.port,
        protocol: "UDP",
      };
      result.push(udpPort);
    } else {
      const tcpPort: ServicePort = {
        port: port.port,
        targetPort: port.targetPort,
        name: name + "-tcp-" + port.port,
        protocol: "TCP",
      };
      result.push(tcpPort);
    }
  });
  return result;
}
