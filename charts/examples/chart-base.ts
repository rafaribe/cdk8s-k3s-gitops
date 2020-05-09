import { App, Chart } from 'cdk8s';
import { Construct } from 'constructs';

export class ChartBase extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);
    //Declare Resources here
  }
}

const app = new App();
new ChartBase(app, 'chartbase');
//app.synth();
