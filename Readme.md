# cdk8s experiment

The idea here is to use cdk8s as an alternative to helm in resources that I'll have to manage by myself.
for some more common use-cases I will also use Helm Releases making use of the Flux Helm Operator.

## Pre-requisites

- yarn/npm (duh! 😝)
- Install [cdk8s](https://github.com/awslabs/cdk8s) `npm install -g cdk8s-cli` / `yarn global cdk8s-cli` 😎

## Project Structure

- [imports](imports) - k8s library by cdk8s, could also be used for other imports
- [cluster/charts](cluster/charts) - Output folder for the kubernetes manifests
- [charts](charts) - CDK8s charts declaration, some make use of lib components.
- [lib](lib) - Reusable components for other apps.
- [main.ts](main.ts) Main file with exports for all the used Charts for our apps( Not helm charts! 😅)

## Useful Commands

- `npm run compile-synth` - This command runs `tsc` and `cdk8s synth` and outputs the `YAML` files into the
  [cluster/charts](cluster/charts) folder.
- `yarn compile-synth`

## References:

For more information in how cdk8s works, please refer to the following links:

[GitHub Repository](https://github.com/awslabs/cdk8s)

[Website](https://cdk8s.io/) (under active development)

[Blog Post](https://brennerm.github.io/posts/cdk8s-the-future-of-k8s-application-deployments.html)
