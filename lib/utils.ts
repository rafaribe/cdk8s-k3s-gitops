import { PortOptions } from "./exposed-app";

export function ensureTargetPortsAreFilled(ports: PortOptions[]) {
  ports.forEach(function (value) {
    if (!value.targetPort) {
      value.targetPort = value.port;
    }
  });
}
