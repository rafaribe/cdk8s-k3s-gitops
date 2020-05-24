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

export function buildServicePorts(ports: number[], protocol: PortProtocol, name: string): ServicePort[] {
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
