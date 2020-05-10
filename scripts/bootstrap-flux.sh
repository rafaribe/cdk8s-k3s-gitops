#!/bin/bash
kubectx k3s

kubectl create namespace flux
# Specific Secret key that I have placed under ignore to not have public exposure, you should create your own or use fluxctl identity.
kubectl apply -f flux-git-deploy.yaml

cd ../cluster/charts
kubectl apply -f flux.k8s.yaml

helm upgrade -i helm-operator fluxcd/helm-operator \
    --namespace flux \
    --set helm.versions=v3 \
    --set serviceAccount.create=false \
    --set image.repository=raspbernetes/helm-operator \
    --set image.tag=v1.0.0-rc9 \
    --set git.ssh.secretName=flux-git-deploy

export FLUX_FORWARD_NAMESPACE=flux

fluxctl sync