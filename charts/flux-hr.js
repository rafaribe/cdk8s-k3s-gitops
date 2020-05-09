'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true,
});
const cdk8s_1 = require('cdk8s');
const helmrelease_1 = require('../imports/helmrelease');
class FluxHr extends cdk8s_1.Chart {
  constructor(scope, name) {
    super(scope, name);
    new helmrelease_1.HelmRelease(
      this,
      'fluxhr',
      {
        metadata: {
          name: 'flux',
          namespace: 'flux',
          annotations: {
            ['fluxcd.io/automated']: 'false',
            ['fluxcd.io/ignore']: 'false',
          },
        },
        spec: {
          releaseName: 'flux',
          chart: {
            repository:
              'https://charts.fluxcd.io/',
            name: 'flux',
            version: '1.3.0',
          },
          values: {
            helmOperator: {
              create: 'false',
            },
          },
        },
      },
    );
  }
}
exports.FluxHr = FluxHr;
const app = new cdk8s_1.App();
new FluxHr(app, 'helmflux');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmx1eC1oci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZsdXgtaHIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBbUM7QUFFbkMsd0RBQXFEO0FBRXJELE1BQWEsTUFBTyxTQUFRLGFBQUs7SUFDL0IsWUFBWSxLQUFnQixFQUFFLElBQVk7UUFDeEMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVuQixJQUFJLHlCQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUM5QixRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLE1BQU07Z0JBQ1osU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLFdBQVcsRUFBRTtvQkFDWCxDQUFDLHFCQUFxQixDQUFDLEVBQUUsT0FBTztvQkFDaEMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLE9BQU87aUJBQzlCO2FBQ0Y7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osV0FBVyxFQUFFLE1BQU07Z0JBQ25CLEtBQUssRUFBRTtvQkFDTCxVQUFVLEVBQUUsMkJBQTJCO29CQUN2QyxJQUFJLEVBQUUsTUFBTTtvQkFDWixPQUFPLEVBQUUsT0FBTztpQkFDakI7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLFlBQVksRUFBRTt3QkFDWixNQUFNLEVBQUUsT0FBTztxQkFDaEI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTVCRCx3QkE0QkM7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM1QixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IEFwcCwgQ2hhcnQgfSBmcm9tICdjZGs4cyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEhlbG1SZWxlYXNlIH0gZnJvbSAnLi4vaW1wb3J0cy9oZWxtcmVsZWFzZSc7XG5cbmV4cG9ydCBjbGFzcyBGbHV4SHIgZXh0ZW5kcyBDaGFydCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIG5hbWU6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBuYW1lKTtcblxuICAgIG5ldyBIZWxtUmVsZWFzZSh0aGlzLCAnZmx1eGhyJywge1xuICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgbmFtZTogJ2ZsdXgnLFxuICAgICAgICBuYW1lc3BhY2U6ICdmbHV4JyxcbiAgICAgICAgYW5ub3RhdGlvbnM6IHtcbiAgICAgICAgICBbJ2ZsdXhjZC5pby9hdXRvbWF0ZWQnXTogJ2ZhbHNlJyxcbiAgICAgICAgICBbJ2ZsdXhjZC5pby9pZ25vcmUnXTogJ2ZhbHNlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzcGVjOiB7XG4gICAgICAgIHJlbGVhc2VOYW1lOiAnZmx1eCcsXG4gICAgICAgIGNoYXJ0OiB7XG4gICAgICAgICAgcmVwb3NpdG9yeTogJ2h0dHBzOi8vY2hhcnRzLmZsdXhjZC5pby8nLFxuICAgICAgICAgIG5hbWU6ICdmbHV4JyxcbiAgICAgICAgICB2ZXJzaW9uOiAnMS4zLjAnLFxuICAgICAgICB9LFxuICAgICAgICB2YWx1ZXM6IHtcbiAgICAgICAgICBoZWxtT3BlcmF0b3I6IHtcbiAgICAgICAgICAgIGNyZWF0ZTogJ2ZhbHNlJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgRmx1eEhyKGFwcCwgJ2hlbG1mbHV4Jyk7XG5hcHAuc3ludGgoKTsiXX0=
