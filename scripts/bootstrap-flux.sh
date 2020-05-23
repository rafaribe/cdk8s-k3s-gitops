#!/bin/bash
echo '---------------------------'
echo '👔Bootstrapping Flux'
echo '---------------------------'
echo '---------------------------'
echo '🖥Switching Shell Context to k3s cluster'
echo '---------------------------'
kubectx k3s

echo '---------------------------'
echo '👔Creating Flux Namespace'
echo '---------------------------'
kubectl create namespace flux
# Specific Secret key that I have placed under ignore to not have public exposure, you should create your own or use fluxctl identity.

cd ../cluster/charts
echo '---------------------------'
echo '🔭Installing Flux'
echo '---------------------------'
kubectl apply -f flux.k8s.yaml
# Helm Operator install
echo '---------------------------'
echo '⚓️Installing Helm Operator'
echo '---------------------------'
helm upgrade -i helm-operator fluxcd/helm-operator \
    --namespace flux \
    --set helm.versions=v3 \
    --set serviceAccount.create=false \
    --set image.repository=raspbernetes/helm-operator \
    --set image.tag=v1.0.0-rc9 \
    --set git.ssh.secretName=flux-git-deploy

export FLUX_FORWARD_NAMESPACE=flux
# Wait for flux to boot up
echo '---------------------------'
echo '⏱ Waiting 25 secs for flux to boot up'
echo '---------------------------'
sleep 25
echo '---------------------------'
echo '✌️Flux sync with the git repository'
echo '---------------------------'
fluxctl identity