'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true,
});
const cdk8s_1 = require('cdk8s');
const flux_1 = require('../lib/flux');
class FluxDaemon extends cdk8s_1.Chart {
  constructor(scope, name) {
    super(scope, name);
    new flux_1.Flux(this, 'flux', {
      arguments: [],
      namespace: 'flux',
      prometheusOperator: true,
      replicas: 1,
      tag: '1.19.0',
      name: 'flux',
    });
  }
}
exports.FluxDaemon = FluxDaemon;
const app = new cdk8s_1.App();
new FluxDaemon(app, 'flux');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx1eC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZsdXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBbUM7QUFFbkMsc0NBQW1DO0FBRW5DLE1BQWEsVUFBVyxTQUFRLGFBQUs7SUFDbkMsWUFBWSxLQUFnQixFQUFFLElBQVk7UUFDeEMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVuQixJQUFJLFdBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ3JCLFNBQVMsRUFBRSxFQUFFO1lBQ2IsU0FBUyxFQUFFLE1BQU07WUFDakIsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVE7WUFDcEQsSUFBSSxFQUFFLE1BQU07U0FDYixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFYRCxnQ0FXQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksV0FBRyxFQUFFLENBQUM7QUFDdEIsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgQ2hhcnQgfSBmcm9tICdjZGs4cyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEZsdXggfSBmcm9tICcuLi9saWIvZmx1eCc7XG5cbmV4cG9ydCBjbGFzcyBGbHV4RGFlbW9uIGV4dGVuZHMgQ2hhcnQge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBuYW1lOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgbmFtZSk7XG5cbiAgICBuZXcgRmx1eCh0aGlzLCAnZmx1eCcsIHtcbiAgICAgIGFyZ3VtZW50czogW10sXG4gICAgICBuYW1lc3BhY2U6ICdmbHV4JyxcbiAgICAgIHByb21ldGhldXNPcGVyYXRvcjogdHJ1ZSwgcmVwbGljYXM6IDEsIHRhZzogJzEuMTkuMCcsXG4gICAgICBuYW1lOiAnZmx1eCdcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgRmx1eERhZW1vbihhcHAsICdmbHV4Jyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==
