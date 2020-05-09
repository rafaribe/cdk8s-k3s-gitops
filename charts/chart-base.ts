import { App, Chart } from 'cdk8s';
import { Construct } from 'constructs';

export class ChartBase extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);
  }
  // Copy paste template to make other chartss
}

const app = new App();
new ChartBase(app, 'chartbase');
//app.synth();